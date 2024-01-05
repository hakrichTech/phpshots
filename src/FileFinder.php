<?php
namespace Hakrichtech\Phpshots;
use Phpshots\Finder\Finder;
class FileFinder {
    private $finder;
    private $directory;
    private $extension;

    /**
     * FileFinder constructor.
     * @param string $directory The directory to search for files.
     * @param string $extension The desired file extension.
     */
    public function __construct($directory, $extension) {
        $this->directory = $directory;
        $this->extension = $extension;
        $this->finder = new Finder();

    }

    /**
     * Find files with the specified extension in the directory and its subdirectories.
     * @return array An array of file pathnames.
     */
    public function findFiles(): bool {
        // find all files in the current directory
        $this->finder->files()->in($this->directory);
      
        return $this->finder->hasResults();

    }

    /**
     * Require the files that match the specified extension.
     */
    public function requireFiles() {
        $isFile = $this->findFiles();

        if($isFile){
            foreach ($this->finder as $file) {
                if ($file->isFile() && $file->getExtension() === $this->extension) {
                    require_once $file->getPathname();
                }
            }
        }
    }
    public function unlink() {
        $isFile = $this->findFiles();

        if($isFile){
            foreach ($this->finder as $file) {
                if ($file->isFile() && $file->getExtension() === $this->extension) {
                    @unlink($file->getPathname());
                }
            }
        }
    }
  public function compilePlugin() {
    $isFile = $this->findFiles();

        if($isFile){
            foreach ($this->finder as $file) {
                if ($file->isFile() && $file->getExtension() === $this->extension) {
                    @symlink($file->getPathname(),LOADER.'plugin/phpshots_'.sha1(uniqid()).'.php');
                }
            }
        }
  }

  public function compileFilters() {
    $isFile = $this->findFiles();

        if($isFile){
            foreach ($this->finder as $file) {
                if ($file->isFile() && $file->getExtension() === $this->extension) {
                    @symlink($file->getPathname(),LOADER.'filters/phpshots_filter'.sha1(uniqid()).'.php');
                }
            }
        }
  }


  public function compileAdminPlugin() {
    $isFile = $this->findFiles();

        if($isFile){
            foreach ($this->finder as $file) {
                if ($file->isFile() && $file->getExtension() === $this->extension) {
                    @symlink($file->getPathname(),LOADER.'admin-plugin/phpshots_'.sha1(uniqid()).'.php');
                }
            }
        }
  }

  public function compileAdminFilters() {
    $isFile = $this->findFiles();

        if($isFile){
            foreach ($this->finder as $file) {
                if ($file->isFile() && $file->getExtension() === $this->extension) {
                    @symlink($file->getPathname(),LOADER.'admin-filters/phpshots_filter'.sha1(uniqid()).'.php');
                }
            }
        }
  }

  
  
}

