<?php
namespace Hakrichtech\Phpshots;

use Composer\Factory;
use Composer\Script\Event;
use Hakrichtech\Phpshots\FileFinder;
use Composer\InstalledVersions;
use Composer\Package\PackageInterface;
use Composer\IO\NullIO; // Import the NullIO class

class ComposerScripts extends InstalledVersions
{
   
    public static function postAutoloadDump(Event $event)
    {
        require_once $event->getComposer()->getConfig()->get('vendor-dir').'/autoload.php';
        self::clearCompiled();
        // Create Composer instance
        $composerRoot = Factory::create(new NullIO());

        // Get the root package
        $rootPackage = $composerRoot->getPackage();

        // Get information about the root package
        $packageName = $rootPackage->getName();

        $namespacesRoot = [];
        $autoloadRoot = $rootPackage->getAutoload();
        if (isset($autoloadRoot['psr-4'])) {
            foreach ($autoloadRoot['psr-4'] as $namespace => $path) {
                $namespacesRoot[rtrim($namespace, '\\')] = $path;
            }
        }
        $allNamespaces = $namespacesRoot + [];

        $composer = $event->getComposer();
        $installedPackages = $composer->getRepositoryManager()->getLocalRepository()->getPackages();

        $phpshotsPackages = [
            $packageName =>[
                'name' => $packageName,
                "namespace" => $namespacesRoot,
                'version' => $rootPackage->getPrettyVersion(),
                'source' => $rootPackage->getInstallationSource(),
                'authors' => (empty($rootPackage->getAuthors()))?[]:$rootPackage->getAuthors()[0],
                'description' => $rootPackage->getDescription(),
                'path' => getcwd(),
                'activate' => true
            ]
        ];

        foreach ($installedPackages as $key => $package) {
            /**
             * 
             * @var PackageInterface $package
             */
            $packageName = $package->getName();
            $namespaceSegments = explode('/', $packageName);

            $namespaces = [];
            // Check if the first namespace is "phpshots"
            if (isset($namespaceSegments[0])) {
                $autoload = $package->getAutoload();
                if (isset($autoload['psr-4'])) {
                    foreach ($autoload['psr-4'] as $namespace => $path) {
                        $namespaces[rtrim($namespace, '\\')] = $path;
                    }
                }

                $allNamespaces = $allNamespaces+$namespaces;
                $phpshotsPackages[$packageName] = [
                    'name' => $packageName,
                    'namespace' => $namespaces,
                    'version' => $package->getPrettyVersion(),
                    'source' => $package->getInstallationSource(),
                    'authors' => (empty($package->getAuthors()))?[]:$package->getAuthors()[0],
                    'description' => $package->getDescription(),
                    'path' => self::getInstallPath($packageName),
                    'activate' => true
                    // Add more information as needed
                ];
            }
        }

        $phpshotsPackages['_namespaces_'] = $allNamespaces;
        // Generate the PHP file content
        $phpFileContent = "<?php\n\nreturn " . var_export($phpshotsPackages, true) . ";\n";

        // Save the content to a file
        $filename = __DIR__ . '/../packages/packagesFound.php';
        file_put_contents($filename, $phpFileContent);

        // Output a message
        echo "Package information saved to: $filename\n";
    }

    /**
     * Clear the cached Laravel bootstrapping files.
     *
     * @return void
     */
    protected static function clearCompiled()
    {
        /** Define ROOTPATH as this file's directory */
        if ( ! defined( 'ROOTPATH' ) ) {
            define( 'ROOTPATH', __DIR__ . '/../');
        }
        define( 'LOADER', ROOTPATH.'loader/' );
       
        

        $plugins = new FileFinder(LOADER.'plugin', 'php');
        $filters = new FileFinder(LOADER.'filters', 'php');
        $filters_admin = new FileFinder(LOADER.'admin-filters', 'php');
        $plugins_admin = new FileFinder(LOADER.'admin-plugin', 'php');

        $plugins->unlink();
        $filters->unlink();
        $plugins_admin->unlink();
        $filters_admin->unlink();

        foreach (InstalledVersions::getInstalledPackages() as $package) {
            $path = InstalledVersions::getInstallPath($package);

            if(is_dir($path.DIRECTORY_SEPARATOR.'loader')){
                $plugin0 = new FileFinder($path.DIRECTORY_SEPARATOR.'loader', 'php');
                $plugin0->compilePlugin();    
            }

            if(is_dir($path.DIRECTORY_SEPARATOR.'admin-loader')){
                $plugin0 = new FileFinder($path.DIRECTORY_SEPARATOR.'admin-loader', 'php');
                $plugin0->compileAdminPlugin();    
            }

            if(is_dir($path.DIRECTORY_SEPARATOR.'package-filters')){
                $plugin0 = new FileFinder($path.DIRECTORY_SEPARATOR.'package-filters', 'php');
                $plugin0->compileFilters();    
            }

            if(is_dir($path.DIRECTORY_SEPARATOR.'admin-filters')){
                $plugin0 = new FileFinder($path.DIRECTORY_SEPARATOR.'admin-filters', 'php');
                $plugin0->compileAdminFilters();    
            }
            
            if(is_dir($path.DIRECTORY_SEPARATOR.'src/loader')){
                $plugin1 = new FileFinder($path.DIRECTORY_SEPARATOR.'src/loader', 'php');
                $plugin1->compilePlugin();
            }
            if(is_dir($path.DIRECTORY_SEPARATOR.'src/admin-loader')){
                $plugin1 = new FileFinder($path.DIRECTORY_SEPARATOR.'src/admin-loader', 'php');
                $plugin1->compileAdminPlugin();
            }

            if(is_dir($path.DIRECTORY_SEPARATOR.'src/package-filters')){
                $plugin1 = new FileFinder($path.DIRECTORY_SEPARATOR.'src/package-filters', 'php');
                $plugin1->compileFilters();
            }

            if(is_dir($path.DIRECTORY_SEPARATOR.'src/admin-filters')){
                $plugin1 = new FileFinder($path.DIRECTORY_SEPARATOR.'src/admin-filters', 'php');
                $plugin1->compileAdminFilters();
            }
            
        }
    }
   

} 

// // Load the package information array
// $packages = include 'path/to/your/packages-array-file.php';

// // Array to keep track of registered namespaces to avoid duplication
// $registeredNamespaces = [];

// // Register an autoloader function using spl_autoload_register
// spl_autoload_register(function ($class) use ($packages, &$registeredNamespaces) {
//     // Iterate through each package in the array
//     foreach ($packages as $packageName => $packageDetails) {
//         // Check if the package is marked as 'activate' and set to true
//         if (isset($packageDetails['activate']) && $packageDetails['activate'] === true) {
//             // Iterate through each namespace in the package
//             foreach ($packageDetails['namespace'] as $namespace => $path) {
//                 // Check if the namespace is not yet registered to avoid duplication
//                 if (!in_array($namespace, $registeredNamespaces)) {
//                     // Prepare the namespace prefix for comparison
//                     $namespacePrefix = str_replace('\\', '\\\\', $namespace);

//                     // Check if the class belongs to the current namespace
//                     if (strpos($class, $namespacePrefix) === 0) {
//                         // Construct the path to the class file based on the namespace
//                         $relativeClass = substr($class, strlen($namespacePrefix));
//                         $classFile = $packageDetails['path'] . '/' . str_replace('\\', '/', $relativeClass) . '.php';

//                         // Check if the class file exists
//                         if (file_exists($classFile)) {
//                             // Include the class file to autoload the class
//                             include $classFile;

//                             // Register the namespace to avoid autoload duplication
//                             $registeredNamespaces[] = $namespace;

//                             // Return to exit the autoloader once the class is found and loaded
//                             return;
//                         }
//                     }
//                 }
//             }
//         }
//     }
// });

// Example: Instantiate a class from the activated packages
// new \Phpshots\Vote\YourClass();
