<?php

// Function to check if parameter exists in the URL
function hasQueryParam($name) {
    return isset($_GET[$name]);
}

global $pagenow;



preg_match( '#/admin.php/?(.*?)$#i', $_SERVER['PHP_SELF'], $self_matches );

$pagenow = ! empty( $self_matches[1] ) ? $self_matches[1] : '';
$pagenow = trim( $pagenow, '/' );
$pagenow = preg_replace( '#\?.*?$#', '', $pagenow );

if ( '' === $pagenow ) {
    $pagenow = 'install';
} else {
    preg_match_all('#([^/]+)#', $pagenow, $self_matches);
    $pagenow = strtolower(implode("_",$self_matches[0]) );
    if ( str_ends_with( $pagenow, '.php' ) ) {
        $pagenow .= substr($pagenow, 0, -4); // For `Options +Multiviews`: /admin/themes/index.php (themes.php is queried).
    }
}


if(hasQueryParam("timezone")){
    // Set the default timezone for the script
    date_default_timezone_set($_GET['timezone']);
}

// Check if the requested URI is the root
if ($_SERVER['REQUEST_URI'] === '/index.php' || !hasQueryParam("os") || !hasQueryParam("browser") || !hasQueryParam("timezone")) {
    // Display JavaScript to collect client information
    echo <<<SCRIPT
      <script>
        // Collect user agent
        var userAgent = navigator.userAgent;
        // Function to get operating system from user agent
        function getOperatingSystem(userAgent) {
            if (/Windows/.test(userAgent)) {
                return "Windows";
            } else if (/Mac OS X/.test(userAgent)) {
                return "Mac OS X";
            } else if (/Linux/.test(userAgent)) {
                return "Linux";
            } else {
                return "Unknown";
            }
        }

        // Function to get browser name from user agent
        function getBrowserName(userAgent) {
            if (/Chrome/.test(userAgent)) {
                return "Chrome";
            } else if (/Firefox/.test(userAgent)) {
                return "Firefox";
            } else if (/Safari/.test(userAgent)) {
                return "Safari";
            } else if (/Edge/.test(userAgent)) {
                return "Microsoft Edge";
            } else if (/MSIE|Trident/.test(userAgent)) {
                return "Internet Explorer";
            } else {
                return "Unknown";
            }
        }

        // Function to get timezone name
        function getTimezoneName() {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }

        // Function to check if parameter exists in the URL
        function hasQueryParam(name) {
            return (new URLSearchParams(window.location.search)).has(name);
        }

        // Function to get the current URL with added parameters
        function getCurrentUrlWithParams() {
            

            // Extract existing parameters from the current URL
            var existingParams = new URLSearchParams(window.location.search);

            
            if (!existingParams.has("os")) {
                existingParams.set("os", getOperatingSystem(userAgent));
            }
            if (!existingParams.has("browser")) {
                existingParams.set("browser", getBrowserName(userAgent));
            }
            if (!existingParams.has("timezone")) {
                existingParams.set("timezone", getTimezoneName());
            }

            // Build the new URL with added parameters
            return window.location.pathname + '?' + existingParams.toString();
        }

        // Function to redirect to the new URL
        function redirectToNewUrl() {
            // Build the new URL with parameters
            var newUrl = "/?os=" + encodeURIComponent(getOperatingSystem(userAgent)) + "&browser=" + encodeURIComponent(getBrowserName(userAgent)) + "&timezone=" + encodeURIComponent(getTimezoneName());
            // Check if the current URL is /index.php
            if (window.location.pathname === "/index.php") {
                // Redirect to the new URL without modifying the current link
                window.location.replace(newUrl);
            } else {
                // Redirect to the new URL by replacing the current link
                window.location.replace(getCurrentUrlWithParams());
            }
                
        }

        // Call the function after a brief delay (you can adjust the delay)
        redirectToNewUrl();
        </script>
SCRIPT;
    exit();
}


print_r([$pagenow]);