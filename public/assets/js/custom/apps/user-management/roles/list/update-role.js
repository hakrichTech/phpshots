"use strict";

function ucwords(str) {
    // Split the string using underscores
    var words = str.split('_');

    // Capitalize the first letter of each word
    var capitalizedWords = words.map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the words back together with spaces
    var result = capitalizedWords.join(' ');

    return result;
}

function formDataToJson(formData) {
    let jsonObject = {};
  
    formData.forEach((value, key) => {
      // Check if the key already exists in the object
      if (jsonObject.hasOwnProperty(key)) {
        // If it's an array, push the new value
        if (!Array.isArray(jsonObject[key])) {
          jsonObject[key] = [jsonObject[key]];
        }
        jsonObject[key].push(value);
      } else {
        // If it doesn't exist, create a new key-value pair
        jsonObject[key] = value;
      }
    });
  
    return jsonObject;
  }

// Merge the two FormData objects, updating values from formData2 for duplicate keys
function mergeFormData(formData1, formData2) {
    let mergedFormData = new FormData();

    // Add formData1 entries
    for (let pair of formData1.entries()) {
        mergedFormData.append(pair[0], pair[1]);
    }

    // Add formData2 entries, updating values for duplicate keys
    for (let pair of formData2.entries()) {
        mergedFormData.set(pair[0], pair[1]);
    }

    return mergedFormData;
}
// Function to append keys from formData1 to formData2 if they do not exist
function appendFormDataKeys(formData1, formData2) {
    for (const [key, value] of formData1.entries()) {
      if (!formData2.has(key)) {
        formData2.append(key, value);
      }
    }

    return formData2;
  }


// Class definition
var KTUsersUpdatePermissions = function () {
    // Shared variables
    const element = document.getElementById('kt_modal_update_role');
    const form = element.querySelector('#kt_modal_update_role_form');
    const modal = new bootstrap.Modal(element);
    var edit_data;
    var fmdata;

    // Init add schedule modal
    var initUpdatePermissions = () => {

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'role_name': {
                        validators: {
                            notEmpty: {
                                message: 'Role name is required'
                            }
                        }
                    },
                },

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );

        // Close button handler
        const closeButton = element.querySelector('[data-kt-roles-modal-action="close"]');
        closeButton.addEventListener('click', e => {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to close?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, close it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    modal.hide(); // Hide modal				
                }
            });
        });

        // Cancel button handler
        const cancelButton = element.querySelector('[data-kt-roles-modal-action="cancel"]');
        cancelButton.addEventListener('click', e => {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal				
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // Submit button handler
        const submitButton = element.querySelector('[data-kt-roles-modal-action="submit"]');
        submitButton.addEventListener('click', function (e) {
            // Prevent default button action
            e.preventDefault();

            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        // Show loading indication
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable button to avoid multiple click 
                        submitButton.disabled = true;
                        var formData = appendFormDataKeys(new FormData(form),fmdata);
                        if (isValidUrl(submitButton.closest('form').getAttribute('action'))){
                            // Check axios library docs: https://axios-http.com/docs/intro
                            axios.post(submitButton.closest('form').getAttribute('action'), formData).then(function (response) {

                                if (response) {
                                    if(response.status == 200 || response.statusText == 'OK'){
                                        if (response.data.status == 1) {

                                            // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                                            Swal.fire({
                                                text: response.data.message,
                                                icon: "success",
                                                buttonsStyling: false,
                                                confirmButtonText: "Ok, got it!",
                                                customClass: {
                                                    confirmButton: "btn btn-primary"
                                                }
                                            }).then(function (result) {
                                                if (result.value) {
                                                    modal.hide(); // Hide modal	
                                                    validator.resetForm(); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
                                                    form.reset();
                                            
                                                    const redirectUrl = form.getAttribute('data-kt-redirect-url');
                                                    if (redirectUrl) {
                                                        location.href = redirectUrl;
                                                    }			
                                                } 
                                            });
                                            
                                        }else{
                                            if (response.data.hasOwnProperty('errors')) {
                                                var html = response.data.errors.join('<br>');
                                                Swal.fire({
                                                    html: html,
                                                    icon: "error",
                                                    buttonsStyling: false,
                                                    confirmButtonText: "Ok, got it!",
                                                    customClass: {
                                                        confirmButton: "btn btn-primary"
                                                    }
                                                });
                                            }else{
                                                Swal.fire({
                                                    text: "Sorry, looks like there are some errors detected, please try again.",
                                                    icon: "error",
                                                    buttonsStyling: false,
                                                    confirmButtonText: "Ok, got it!",
                                                    customClass: {
                                                        confirmButton: "btn btn-primary"
                                                    }
                                                });
                                            }
                                        }
                                        
                                    }else{
                                        Swal.fire({
                                            text: "Sorry, looks like there are some errors detected, please try again.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        });
                                    }
                                    
                                } else {
                                    // Show popup warning. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                                    Swal.fire({
                                        text: "Sorry, looks like there are some errors detected, please try again.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });
                                }
                            }).catch(function (error) {
                                Swal.fire({
                                    text: "Sorry, looks like there are some errors detected, please try again.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                });
                            }).then(() => {
                                // Hide loading indication
                                submitButton.removeAttribute('data-kt-indicator');

                                // Enable button
                                submitButton.disabled = false;
                            });
                        }else{

                            // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            setTimeout(function () {
                                // Remove loading indication
                                submitButton.removeAttribute('data-kt-indicator');

                                // Enable button
                                submitButton.disabled = false;

                                // Show popup confirmation 
                                Swal.fire({
                                    text: "Form has been successfully submitted!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        modal.hide();
                                    }
                                });

                                //form.submit(); // Submit form
                            }, 2000);
                        }
                    } else {
                        // Show popup warning. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "Sorry, looks like there are some errors detected, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            }
        });
    }

    var isValidUrl = function(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    // Select all handler
    const handleSelectAll = () => {
        // Define variables
        const selectAll = form.querySelector('#kt_roles_select_all');
        const allCheckboxes = form.querySelectorAll('[type="checkbox"]');

        // Handle check state
        selectAll.addEventListener('change', e => {

            // Apply check state to all checkboxes
            allCheckboxes.forEach(c => {
                c.checked = e.target.checked;
            });
        });
    }

    // Assuming jsObject is already defined from the previous code

// Function to generate and insert HTML template
const generateAndInsertTemplate = () => {
    // Reference to the tbody element
    const tbody = document.querySelector('#data-body-role');

    // Clear existing content in tbody
    tbody.innerHTML = '';
    

    // Insert the "Administrator Access" row
    const adminAccessTr = document.createElement('tr');

    const adminAccessLabelTd = document.createElement('td');
    adminAccessLabelTd.className = 'text-gray-800';
    adminAccessLabelTd.textContent = 'Administrator Access ';

    const adminAccessInfoSpan = document.createElement('span');
    adminAccessInfoSpan.className = 'ms-1';
    adminAccessInfoSpan.setAttribute('data-bs-toggle', 'tooltip');
    adminAccessInfoSpan.setAttribute('title', 'Allows full access to the system');

    const adminAccessInfoIcon = document.createElement('i');
    adminAccessInfoIcon.className = 'ki-outline ki-information-5 text-gray-500 fs-6';

    adminAccessInfoSpan.appendChild(adminAccessInfoIcon);
    adminAccessLabelTd.appendChild(adminAccessInfoSpan);
    adminAccessTr.appendChild(adminAccessLabelTd);

    const adminAccessCheckboxTd = document.createElement('td');
    const adminAccessCheckboxLabel = document.createElement('label');
    adminAccessCheckboxLabel.className = 'form-check form-check-sm form-check-custom form-check-solid me-9';

    const adminAccessCheckbox = document.createElement('input');
    adminAccessCheckbox.className = 'form-check-input';
    adminAccessCheckbox.type = 'checkbox';
    adminAccessCheckbox.value = '';
    adminAccessCheckbox.id = 'kt_roles_select_all';

    const adminAccessCheckboxLabelSpan = document.createElement('span');
    adminAccessCheckboxLabelSpan.className = 'form-check-label';
    adminAccessCheckboxLabelSpan.setAttribute('for', 'kt_roles_select_all');
    adminAccessCheckboxLabelSpan.textContent = 'Select all';

    adminAccessCheckboxLabel.appendChild(adminAccessCheckbox);
    adminAccessCheckboxLabel.appendChild(adminAccessCheckboxLabelSpan);
    adminAccessCheckboxTd.appendChild(adminAccessCheckboxLabel);
    adminAccessTr.appendChild(adminAccessCheckboxTd);

    tbody.appendChild(adminAccessTr);
  
    // Iterate through each capability and generate HTML
    for (const capabilityName in edit_data.info.capabilities) {
      const tr = document.createElement('tr');
      
      // Label for capability
      const labelTd = document.createElement('td');
      labelTd.className = 'text-gray-800';
      labelTd.textContent = ucwords(capabilityName);
      tr.appendChild(labelTd);
  
      // Input group for checkboxes
      const inputGroupTd = document.createElement('td');
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.className = 'd-flex';
  
      // Iterate through each type (read, write, delete)
      const types = ['read', 'write', 'delete'];
      for (const type of types) {
        var Type = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the first letter
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20';
  
        const checkbox = document.createElement('input');
        checkbox.className = 'form-check-input';
        checkbox.type = 'checkbox';
        checkbox.value = '';
        checkbox.name = `${type}_${capabilityName}`;

         // Convert the string to a boolean using JSON.parse
        const isChecked = edit_data.info.capabilities[capabilityName][Type];        
        checkbox.checked = isChecked;
        // Set a meaningful value for the checkbox
        checkbox.value = isChecked ? 'on' : 'off';
        fmdata.append(`${type}_${capabilityName}`,isChecked ? 'on' : 'off');

        // Add an onchange event listener
        checkbox.addEventListener('change', function (e) {
             if (e.target.checked) {
                e.target.value = 'on';
                fmdata.set(e.target.name, 'on');
             }else{
                e.target.value = 'off';
                fmdata.set(e.target.name, 'off');

             }
        });
  
        const checkboxLabelText = document.createElement('span');
        checkboxLabelText.className = 'form-check-label';
        checkboxLabelText.textContent = Type
  
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkboxLabelText);
        checkboxWrapper.appendChild(checkboxLabel);
      }
  
      inputGroupTd.appendChild(checkboxWrapper);
      tr.appendChild(inputGroupTd);
  
      // Append the generated row to tbody
      tbody.appendChild(tr);
    }
  }
  
  
 

    return {
        // Public functions
        init: function () {
            $('#kt_modal_update_role').on('show.bs.modal', function (event) {
                fmdata = new FormData;
                form.reset();
                // Get the button that triggered the modal
                var triggerButton = event.relatedTarget;
                edit_data = JSON.parse(triggerButton.getAttribute('data-kt-role-edited'));
                // Set the JSON data into the modal
                // console.log(edit_data);
                // Accessing the value
                const roleNameValue = edit_data.info.name;
                fmdata.append('role_ID',edit_data.rid);

                // Setting the value to an input field with the name 'role_name'
                document.querySelector('#editValuRole').value = roleNameValue;

                // Call the function to generate and insert the template
                generateAndInsertTemplate();
                initUpdatePermissions();
                handleSelectAll();
            });
            
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTUsersUpdatePermissions.init();
});