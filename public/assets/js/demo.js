// Define the encryption function with a single parameter (the data to be encrypted).
function encrypt(data) {
    let newString = window.keying.replace('--b--', "-----BEGIN PUBLIC KEY-----");
    var publicKey = newString.replace('--e--', "-----END PUBLIC KEY-----");

    var encrypt = new JSEncrypt(); // Create a new instance of the JSEncrypt library.
    encrypt.setPublicKey(publicKey); // Set the public key for the encryption library.
    var encrypted = encrypt.encrypt(data); // Use the encrypt method of the library to encrypt the data.
    
    return encrypted; // Return the encrypted data.
}

  
  // Function to check if the href is from an allowed domain
function isAllowedDomain(href, allowedDomains) {
    var url = new URL(href,window.location.href);
  
    // Check if the hostname is in the allowed domains list
    return allowedDomains.some(domain => url.hostname.includes(domain));
  }
  
  

  
  // Function to get the timezone name (abbreviation)
  function getTimezoneName() {
    var timezoneAbbreviation = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    return timezoneAbbreviation;
  }
  
  
 // Function to add parameters to anchor URLs and form actions
function addParameters() {
  // Get all anchor elements on the page
  var anchors = document.getElementsByTagName('a');

  // Get all form elements on the page
  var forms = document.getElementsByTagName('form');

  // Get the browser name, operating system, and timezone name
  var browserName = getBrowserName();
  var operatingSystem = getOperatingSystem();
  var timezoneName = getTimezoneName();

  for (var i = 0; i < anchors.length; i++) {
      var href = anchors[i].getAttribute('href');
      var isHashLink = href && href.startsWith('#');
      var isAlloweddomain = isAllowedDomain(href, window.allowedDomains);

      if (!isHashLink && isAlloweddomain) {
          processElement(anchors[i], 'href', browserName, operatingSystem, timezoneName);
      }
  }

  // Process form elements
  for (var j = 0; j < forms.length; j++) {
      processElement(forms[j], 'action', browserName, operatingSystem, timezoneName);
  }
}

// Function to process elements (anchor or form) and add parameters
function processElement(element, attributeName, browserName, operatingSystem, timezoneName) {
  // Get the current attribute value
  var currentAttribute = element.getAttribute(attributeName);

  // Check if the element has the attribute
  if (currentAttribute !== null) {
      var updatedAttribute;

      // Check if the attribute starts with '/'
      if (attributeName === 'href' && currentAttribute.startsWith('/')) {
          // Construct an absolute URL by combining the base URL and the relative path
          updatedAttribute = new URL(currentAttribute, window.location.href).toString();
      } else {
          updatedAttribute = currentAttribute;
      }

      // Add or update the parameters
      updatedAttribute +=
          (updatedAttribute.includes('?') ? '&' : '?') +
          'browser=' + encodeURIComponent(browserName) +
          '&os=' + encodeURIComponent(operatingSystem) +
          '&timezone=' + encodeURIComponent(timezoneName);

      // Update the attribute with the new value
      element.setAttribute(attributeName, updatedAttribute);
  }
}

// Function to get the browser name
function getBrowserName() {
  var userAgent = navigator.userAgent;
  var browserName = 'Unknown';

  if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
  } else if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
  } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
  } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
      browserName = 'Edge';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
      browserName = 'Internet Explorer';
  }

  return browserName;
}

// Function to get the operating system
function getOperatingSystem() {
  var platform = navigator.platform;
  var userAgent = navigator.userAgent;
  var os = 'Unknown';

  if (platform.indexOf('Win') > -1) {
      os = 'Windows';
  } else if (platform.indexOf('Mac') > -1) {
      os = 'MacOS';
  } else if (platform.indexOf('Linux') > -1) {
      os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
      os = 'Android';
  } else if (userAgent.indexOf('iOS') > -1) {
      os = 'iOS';
  }

  return os;
}



"use strict";

// Class definition
var KTFileUploader = function () {

    // Init dropzone
    const initDropzone = () => {
        // Get the browser name, operating system, and timezone name
        var browserName = getBrowserName();
        var operatingSystem = getOperatingSystem();
        var timezoneName = getTimezoneName();

        var params = '?browser=' + encodeURIComponent(browserName) +
        '&os=' + encodeURIComponent(operatingSystem) +
        '&timezone=' + encodeURIComponent(timezoneName);

        // set the dropzone container id
        const id = "#kt_dropzonejs_example_2";
        const dropzone = document.querySelector(id);

        // set the preview element template
        var previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
            url: "/api/upload"+params, // Set the url for your upload script location
            parallelUploads: 20,
            previewTemplate: previewTemplate,
            maxFilesize: 1, // Max filesize in MB
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select" // Define the element that should be used as click trigger to select files.
        });

        myDropzone.on("addedfile", function (file) {
            // Hookup the start button
            file.previewElement.querySelector(id + " .dropzone-start").onclick = function () { myDropzone.enqueueFile(file); };
            const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
            dropzoneItems.forEach(dropzoneItem => {
                dropzoneItem.style.display = '';
            });
            dropzone.querySelector('.dropzone-upload').style.display = "inline-block";
            dropzone.querySelector('.dropzone-remove-all').style.display = "inline-block";
        });

        // Update the total progress bar
        myDropzone.on("totaluploadprogress", function (progress) {
            const progressBars = dropzone.querySelectorAll('.progress-bar');
            progressBars.forEach(progressBar => {
                progressBar.style.width = progress + "%";
            });
        });

        myDropzone.on("sending", function (file) {
            // Show the total progress bar when upload starts
            const progressBars = dropzone.querySelectorAll('.progress-bar');
            progressBars.forEach(progressBar => {
                progressBar.style.opacity = "1";
            });
            // And disable the start button
            file.previewElement.querySelector(id + " .dropzone-start").setAttribute("disabled", "disabled");
        });

        // Hide the total progress bar when nothing's uploading anymore
        myDropzone.on("complete", function (progress) {
            const progressBars = dropzone.querySelectorAll('.dz-complete');

            setTimeout(function () {
                progressBars.forEach(progressBar => {
                    progressBar.querySelector('.progress-bar').style.opacity = "0";
                    progressBar.querySelector('.progress').style.opacity = "0";
                    progressBar.querySelector('.dropzone-start').style.opacity = "0";
                });
            }, 300);
        });

        // Setup the buttons for all transfers
        dropzone.querySelector(".dropzone-upload").addEventListener('click', function () {
            myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
        });

        // Setup the button for remove all files
        dropzone.querySelector(".dropzone-remove-all").addEventListener('click', function () {
            dropzone.querySelector('.dropzone-upload').style.display = "none";
            dropzone.querySelector('.dropzone-remove-all').style.display = "none";
            myDropzone.removeAllFiles(true);
        });

        // On all files completed upload
        myDropzone.on("queuecomplete", function (progress) {
            const uploadIcons = dropzone.querySelectorAll('.dropzone-upload');
            uploadIcons.forEach(uploadIcon => {
                uploadIcon.style.display = "none";
            });
        });

        // On all files removed
        myDropzone.on("removedfile", function (file) {
            if (myDropzone.files.length < 1) {
                dropzone.querySelector('.dropzone-upload').style.display = "none";
                dropzone.querySelector('.dropzone-remove-all').style.display = "none";
            }
        });


    }

   


    // Public methods
    return {
        init: function () {
            initDropzone();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTFileUploader.init();
    addParameters();
});