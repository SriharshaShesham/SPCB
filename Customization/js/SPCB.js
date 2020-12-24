


// --------------------- Section: User Permissions -----------------------------

//Get current login user data
function GetUserLogin(successFunction, errorFunction) {
    var userid = _spPageContextInfo.userId;
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: successFunction,
        error: errorFunction
    });
}

//Get all the permission groups to which the current logged in user belong to
function GetUserGroups(successFunction, errorFunction) {
    var userIsInGroup = false;
    // debugger
    console.log(_spPageContextInfo.webAbsoluteUrl);
    $.ajax({
        async: false,
        headers: { "accept": "application/json; odata=verbose" },
        method: "GET",
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/groups",
        success: successFunction,
        error: errorFunction,
    });
}


// ----------------------------- Section: Forms -----------------------------

// Add Bootstrap styles to the Form
function AddBootstrapStylesToForm(formTable) {
    $('#DeltaPlaceHolderMain').addClass('bootstrap-4');
    $('#DeltaPlaceHolderMain table').addClass('mx-auto').attr('style', 'width:95%');
    $('#pageContentTitle').attr("style", "text-align:center !important;width:100% !important");
    formTable.addClass('container table table-bordered table-striped bootstrap-form-font');
    formTable.find('input,select,textArea').addClass("form-control");
    formTable.find('button').addClass("btn btn-primary mb-2");
    formTable.find('.ms-formlabel').addClass('col-form-label');
    formTable.find('.ms-formvalidation');
    formTable.find(".ms-metadata").each(function () {
        var addWithBreak = $(this).append('<br/><br/>')
        $(this).parent().prepend(addWithBreak);
    });
}


//Replace the SharePoint Datepicker with the JQuery-UI datepicker. As the SP Datepicker sets some crazy default date.
//Requires JQuery-UI
function ImproveDatePicker(obj) {
    obj.focus(function () { obj.select(); });
    if (typeof jQuery.ui.datepicker != "undefined") {
        obj.datepicker({
            dateFormat: "mm/dd/yy",
            showOtherMonths: true,
            selectOtherMonths: true,
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true
        });
        obj.parent().next().children("a").removeAttr('onclick');
        obj.parent().next().children("a").click(function () { obj.select(); });
        obj.closest('tr').find("img[id$='DatePickerImage']").remove();
    }
}


// Turn your very long form into sections using the Section Headers. Please go through the blog for details

function AddSectionHeaderToForm(headerTitle, sectionStartFieldTitle, addExtraSpace, id) {
    if (addExtraSpace) {
        $('<tr class="bg-white text-light text-center bootstrap-form-font"><td colspan="2"></td></tr>').insertBefore(sectionStartFieldTitle);
    }
    $('<tr id=' + id + ' class="bg-primary-dark text-light text-center bootstrap-form-font"><td colspan="2">' + headerTitle + '</td></tr>').insertBefore(sectionStartFieldTitle);
}

// Hide certain sections of the form that are set using above code block
function HideFormSection(startTr, endTr) {
    if (!startTr.is('tr'))
        startTr = startTr.closest('td.ms-formbody').parent('tr');
    if (!endTr.is('tr'))
        endTr = endTr.closest('td.ms-formbody').parent('tr');
    //  debugger
    while (startTr.next()) {
        startTr.addClass('isHidden');
        startTr = startTr.next();
        if (startTr.children('td:first').text() == endTr.children('td:first').text())
            break;
    }
    endTr.addClass('isHidden');
}

// Show certain sections of the form that are set using above code block
function ShowFormSection(startTr, endTr) {
    if (!startTr.is('tr'))
        startTr = startTr.closest('td.ms-formbody').parent('tr');
    if (!endTr.is('tr'))
        endTr = endTr.closest('td.ms-formbody').parent('tr');
    //  debugger
    while (startTr.next()) {
        startTr.removeClass('isHidden');
        startTr = startTr.next();
        if (startTr.children('td:first').text() == endTr.children('td:first').text())
            break;
    }
    endTr.removeClass('isHidden');
}


// You may also disable the sections of the form that are set using above code block
function DisableFormSection(startTr, endTr) {
    if (!startTr.is('tr'))
        startTr = startTr.closest('td.ms-formbody').parent('tr');
    if (!endTr.is('tr'))
        endTr = endTr.closest('td.ms-formbody').parent('tr');
    //  debugger 
    while (startTr.next()) {
        //logic to disable fields
        startTr.find('input,select,textarea').attr('disabled', true).attr('style', 'color: #5a5a5a !important');
        // below lines are mandatory don't change
        startTr = startTr.next();
        if (startTr.children('td:first').text() == endTr.children('td:first').text())
            break;
    }
    endTr.find('input,select,textarea').attr('disabled', true).attr('style', 'color: #5a5a5a !important');
}

//Convert a SP single line field to Phone number field which only accepts number and 10 number (format: 222-222-2222)
function ConvertSingleLineToPhoneNumberField(fieldToConvert) {
    fieldToConvert.attr('maxlength', 12);
    fieldToConvert.keydown(function (e) {
        var key = e.charCode || e.keyCode || 0;
        $text = $(this);
        if (key !== 8 && key !== 9) {
            if ($text.val().length === 3) {
                $text.val($text.val() + '-');
            }
            if ($text.val().length === 7) {
                $text.val($text.val() + '-');
            }
        }
        return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
    });
}

//validate the fields for non-blank inputs 
function ValidateFields(fieldsToValidate) {
    var retVal = false;
    for (var i = 0; i < fieldsToValidate.length; i++) {
        var elementToValidate = fieldsToValidate[i];
        if (elementToValidate.val() == "" || elementToValidate.val() == null) {
            // //console.log("validation error for"+elementToValidate.val())
            if (elementToValidate.closest('span').find('.validationError').length == 0) {
                elementToValidate.closest('span').append('<div class="validationError"><span class="ms-formvalidation"><span role="alert">You must specify a value for this required field.</span><br></span></div>');
            }
            else {
                // //console.log("already displayed");
            }
            retVal = false;
        }
        else {
            // //console.log("no validation error");
            if (elementToValidate.closest('span').find('.validationError').length !== 0) {
                elementToValidate.closest('span').find('.validationError').remove();
            }
            retVal = true;
        }
    }
    return retVal;
}

// Convert SharePoint date to Javascript date
function ConvertSPDateToJSDate(spDate) {
    var obj = new Object();
    // split apart the date and time
    var xDate = spDate.split(" ")[0];
    // split apart the year, month, & day
    var xDateParts = xDate.split("/");
    obj.Year = xDateParts[2];
    obj.Month = xDateParts[0];
    obj.Day = xDateParts[1];
    var jsDate = new Date(obj.Year, obj.Month, obj.Day);
    obj.jsDate = jsDate
    return obj;
}

// Remove duplicates from any html dropdown
function RemoveDuplicatesInDropDown(dropDownObject) {
    var optionValues = {};
    $(dropDownObject).find('option').each(function () {
        // //console.log($(this).text());
        if (optionValues[$(this).text()]) {
            $(this).remove();
        } else {
            optionValues[$(this).text()] = $(this).text();
        }
    });
}

// Set a default dropdown value may it be "Select"/ "NA"
function SetDefaultDropDownValue(ddField, ddValue) {
    if ($(ddField).find('#emptyOption').length == 0) {
        $(ddField).append("<option id='emptyOption' selected>--" + ddValue + "--</option>");
    }
    else {
        $(ddField).find('#emptyOption').attr('selected', 'selected');
    }
}


function CheckIfPageIsEditForm() {
    var url=window.location.href;
    // PageView=Shared
    if (url.indexOf("EditForm")>-1) {
        return true;
    }
    else {
        return false;
    }
}

// Get form dialog type if edit or new 
function GetDialogFormType() {
    var action = $('.ms-dlgFrame').contents().find('form').attr('action');
    if (action.indexOf('Mode=Upload') != -1) {
        return "Upload";
    }
    else {
        return "New";
    }
}

// Hide Fields in the form
function HideFields(fieldsToHide) {
    for (var i = 0; i < fieldsToHide.length; i++) {
        var elementTohide = $(fieldsToHide[i].closest('td.ms-formlabel').closest('tr'));
        if (elementTohide.html()) {
            $(fieldsToHide[i].closest('td.ms-formlabel').closest('tr')).hide();
        } else {
            $(fieldsToHide[i].closest('td.ms-formbody').closest('tr')).hide();
        }
    }
}

// Unhide fields in the form
function UnHideFields(fieldsToUnhide) {
    for (var i = 0; i < fieldsToUnhide.length; i++) {
        var elementToUnHide = $(fieldsToUnhide[i].closest('td.ms-formlabel').closest('tr'));
        if (elementToUnHide.html()) {
            $(fieldsToUnhide[i].closest('td.ms-formlabel').closest('tr')).show();
        } else {
            $(fieldsToUnhide[i].closest('td.ms-formbody').closest('tr')).show();
        }
    }
}

// Disable fields
function DisableFields(arrayOfFieldsToDisable) {
    console.log("DisablingFields");
    for (var i = 0; i < arrayOfFieldsToDisable.length; i++) {
        arrayOfFieldsToDisable[i].closest('td.ms-formbody').find('input,select,textarea').attr('disabled', true).attr('style', 'color: #5a5a5a !important');
    }
}

// Enable Fields
function EnableFields(arrayOfFieldsToEnable) {
    for (var i = 0; i < arrayOfFieldsToEnable.length; i++) {
        arrayOfFieldsToEnable[i].closest('td.ms-formbody').find('input,select,textarea').attr('disabled', false).attr('style', 'color: #5a5a5a !important');
    }
}

// Format the date to local format
function ConvertToLocaleDateString(d) {
    console.log("Date: " + d);
    var f = {
        "ar-SA": "dd/MM/yy",
        "bg-BG": "dd.M.yyyy",
        "ca-ES": "dd/MM/yyyy",
        "zh-TW": "yyyy/M/d",
        "cs-CZ": "d.M.yyyy",
        "da-DK": "dd-MM-yyyy",
        "de-DE": "dd.MM.yyyy",
        "el-GR": "d/M/yyyy",
        "en-US": "M/d/yyyy",
        "fi-FI": "d.M.yyyy",
        "fr-FR": "dd/MM/yyyy",
        "he-IL": "dd/MM/yyyy",
        "hu-HU": "yyyy. MM. dd.",
        "is-IS": "d.M.yyyy",
        "it-IT": "dd/MM/yyyy",
        "ja-JP": "yyyy/MM/dd",
        "ko-KR": "yyyy-MM-dd",
        "nl-NL": "d-M-yyyy",
        "nb-NO": "dd.MM.yyyy",
        "pl-PL": "yyyy-MM-dd",
        "pt-BR": "d/M/yyyy",
        "ro-RO": "dd.MM.yyyy",
        "ru-RU": "dd.MM.yyyy",
        "hr-HR": "d.M.yyyy",
        "sk-SK": "d. M. yyyy",
        "sq-AL": "yyyy-MM-dd",
        "sv-SE": "yyyy-MM-dd",
        "th-TH": "d/M/yyyy",
        "tr-TR": "dd.MM.yyyy",
        "ur-PK": "dd/MM/yyyy",
        "id-ID": "dd/MM/yyyy",
        "uk-UA": "dd.MM.yyyy",
        "be-BY": "dd.MM.yyyy",
        "sl-SI": "d.M.yyyy",
        "et-EE": "d.MM.yyyy",
        "lv-LV": "yyyy.MM.dd.",
        "lt-LT": "yyyy.MM.dd",
        "fa-IR": "MM/dd/yyyy",
        "vi-VN": "dd/MM/yyyy",
        "hy-AM": "dd.MM.yyyy",
        "az-Latn-AZ": "dd.MM.yyyy",
        "eu-ES": "yyyy/MM/dd",
        "mk-MK": "dd.MM.yyyy",
        "af-ZA": "yyyy/MM/dd",
        "ka-GE": "dd.MM.yyyy",
        "fo-FO": "dd-MM-yyyy",
        "hi-IN": "dd-MM-yyyy",
        "ms-MY": "dd/MM/yyyy",
        "kk-KZ": "dd.MM.yyyy",
        "ky-KG": "dd.MM.yy",
        "sw-KE": "M/d/yyyy",
        "uz-Latn-UZ": "dd/MM yyyy",
        "tt-RU": "dd.MM.yyyy",
        "pa-IN": "dd-MM-yy",
        "gu-IN": "dd-MM-yy",
        "ta-IN": "dd-MM-yyyy",
        "te-IN": "dd-MM-yy",
        "kn-IN": "dd-MM-yy",
        "mr-IN": "dd-MM-yyyy",
        "sa-IN": "dd-MM-yyyy",
        "mn-MN": "yy.MM.dd",
        "gl-ES": "dd/MM/yy",
        "kok-IN": "dd-MM-yyyy",
        "syr-SY": "dd/MM/yyyy",
        "dv-MV": "dd/MM/yy",
        "ar-IQ": "dd/MM/yyyy",
        "zh-CN": "yyyy/M/d",
        "de-CH": "dd.MM.yyyy",
        "en-GB": "dd/MM/yyyy",
        "es-MX": "dd/MM/yyyy",
        "fr-BE": "d/MM/yyyy",
        "it-CH": "dd.MM.yyyy",
        "nl-BE": "d/MM/yyyy",
        "nn-NO": "dd.MM.yyyy",
        "pt-PT": "dd-MM-yyyy",
        "sr-Latn-CS": "d.M.yyyy",
        "sv-FI": "d.M.yyyy",
        "az-Cyrl-AZ": "dd.MM.yyyy",
        "ms-BN": "dd/MM/yyyy",
        "uz-Cyrl-UZ": "dd.MM.yyyy",
        "ar-EG": "dd/MM/yyyy",
        "zh-HK": "d/M/yyyy",
        "de-AT": "dd.MM.yyyy",
        "en-AU": "d/MM/yyyy",
        "es-ES": "dd/MM/yyyy",
        "fr-CA": "yyyy-MM-dd",
        "sr-Cyrl-CS": "d.M.yyyy",
        "ar-LY": "dd/MM/yyyy",
        "zh-SG": "d/M/yyyy",
        "de-LU": "dd.MM.yyyy",
        "en-CA": "dd/MM/yyyy",
        "es-GT": "dd/MM/yyyy",
        "fr-CH": "dd.MM.yyyy",
        "ar-DZ": "dd-MM-yyyy",
        "zh-MO": "d/M/yyyy",
        "de-LI": "dd.MM.yyyy",
        "en-NZ": "d/MM/yyyy",
        "es-CR": "dd/MM/yyyy",
        "fr-LU": "dd/MM/yyyy",
        "ar-MA": "dd-MM-yyyy",
        "en-IE": "dd/MM/yyyy",
        "es-PA": "MM/dd/yyyy",
        "fr-MC": "dd/MM/yyyy",
        "ar-TN": "dd-MM-yyyy",
        "en-ZA": "yyyy/MM/dd",
        "es-DO": "dd/MM/yyyy",
        "ar-OM": "dd/MM/yyyy",
        "en-JM": "dd/MM/yyyy",
        "es-VE": "dd/MM/yyyy",
        "ar-YE": "dd/MM/yyyy",
        "en-029": "MM/dd/yyyy",
        "es-CO": "dd/MM/yyyy",
        "ar-SY": "dd/MM/yyyy",
        "en-BZ": "dd/MM/yyyy",
        "es-PE": "dd/MM/yyyy",
        "ar-JO": "dd/MM/yyyy",
        "en-TT": "dd/MM/yyyy",
        "es-AR": "dd/MM/yyyy",
        "ar-LB": "dd/MM/yyyy",
        "en-ZW": "M/d/yyyy",
        "es-EC": "dd/MM/yyyy",
        "ar-KW": "dd/MM/yyyy",
        "en-PH": "M/d/yyyy",
        "es-CL": "dd-MM-yyyy",
        "ar-AE": "dd/MM/yyyy",
        "es-UY": "dd/MM/yyyy",
        "ar-BH": "dd/MM/yyyy",
        "es-PY": "dd/MM/yyyy",
        "ar-QA": "dd/MM/yyyy",
        "es-BO": "dd/MM/yyyy",
        "es-SV": "dd/MM/yyyy",
        "es-HN": "dd/MM/yyyy",
        "es-NI": "dd/MM/yyyy",
        "es-PR": "dd/MM/yyyy",
        "am-ET": "d/M/yyyy",
        "tzm-Latn-DZ": "dd-MM-yyyy",
        "iu-Latn-CA": "d/MM/yyyy",
        "sma-NO": "dd.MM.yyyy",
        "mn-Mong-CN": "yyyy/M/d",
        "gd-GB": "dd/MM/yyyy",
        "en-MY": "d/M/yyyy",
        "prs-AF": "dd/MM/yy",
        "bn-BD": "dd-MM-yy",
        "wo-SN": "dd/MM/yyyy",
        "rw-RW": "M/d/yyyy",
        "qut-GT": "dd/MM/yyyy",
        "sah-RU": "MM.dd.yyyy",
        "gsw-FR": "dd/MM/yyyy",
        "co-FR": "dd/MM/yyyy",
        "oc-FR": "dd/MM/yyyy",
        "mi-NZ": "dd/MM/yyyy",
        "ga-IE": "dd/MM/yyyy",
        "se-SE": "yyyy-MM-dd",
        "br-FR": "dd/MM/yyyy",
        "smn-FI": "d.M.yyyy",
        "moh-CA": "M/d/yyyy",
        "arn-CL": "dd-MM-yyyy",
        "ii-CN": "yyyy/M/d",
        "dsb-DE": "d. M. yyyy",
        "ig-NG": "d/M/yyyy",
        "kl-GL": "dd-MM-yyyy",
        "lb-LU": "dd/MM/yyyy",
        "ba-RU": "dd.MM.yy",
        "nso-ZA": "yyyy/MM/dd",
        "quz-BO": "dd/MM/yyyy",
        "yo-NG": "d/M/yyyy",
        "ha-Latn-NG": "d/M/yyyy",
        "fil-PH": "M/d/yyyy",
        "ps-AF": "dd/MM/yy",
        "fy-NL": "d-M-yyyy",
        "ne-NP": "M/d/yyyy",
        "se-NO": "dd.MM.yyyy",
        "iu-Cans-CA": "d/M/yyyy",
        "sr-Latn-RS": "d.M.yyyy",
        "si-LK": "yyyy-MM-dd",
        "sr-Cyrl-RS": "d.M.yyyy",
        "lo-LA": "dd/MM/yyyy",
        "km-KH": "yyyy-MM-dd",
        "cy-GB": "dd/MM/yyyy",
        "bo-CN": "yyyy/M/d",
        "sms-FI": "d.M.yyyy",
        "as-IN": "dd-MM-yyyy",
        "ml-IN": "dd-MM-yy",
        "en-IN": "dd-MM-yyyy",
        "or-IN": "dd-MM-yy",
        "bn-IN": "dd-MM-yy",
        "tk-TM": "dd.MM.yy",
        "bs-Latn-BA": "d.M.yyyy",
        "mt-MT": "dd/MM/yyyy",
        "sr-Cyrl-ME": "d.M.yyyy",
        "se-FI": "d.M.yyyy",
        "zu-ZA": "yyyy/MM/dd",
        "xh-ZA": "yyyy/MM/dd",
        "tn-ZA": "yyyy/MM/dd",
        "hsb-DE": "d. M. yyyy",
        "bs-Cyrl-BA": "d.M.yyyy",
        "tg-Cyrl-TJ": "dd.MM.yy",
        "sr-Latn-BA": "d.M.yyyy",
        "smj-NO": "dd.MM.yyyy",
        "rm-CH": "dd/MM/yyyy",
        "smj-SE": "yyyy-MM-dd",
        "quz-EC": "dd/MM/yyyy",
        "quz-PE": "dd/MM/yyyy",
        "hr-BA": "d.M.yyyy.",
        "sr-Latn-ME": "d.M.yyyy",
        "sma-SE": "yyyy-MM-dd",
        "en-SG": "d/M/yyyy",
        "ug-CN": "yyyy-M-d",
        "sr-Cyrl-BA": "d.M.yyyy",
        "es-US": "M/d/yyyy"
    };
    var l = navigator.language ? navigator.language : navigator['userLanguage'], y = d.getFullYear(), m = d.getMonth() + 1, d = d.getDate();
    f = (l in f) ? f[l] : "MM/dd/yyyy";
    function z(s) { s = '' + s; return s.length > 1 ? s : '0' + s; }
    f = f.replace(/yyyy/, y); f = f.replace(/yy/, String(y).substr(2));
    f = f.replace(/MM/, z(m)); f = f.replace(/M/, m);
    f = f.replace(/dd/, z(d)); f = f.replace(/d/, d);
    return f;
}


// ----------------------------- Section: Miscellaneous -----------------------------

//Get all the query strings for current page.
function GetQueryStrings() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//Get Query String for the key
function GetQueryString(key) {
    var urlValues = GetQueryStrings();
    return urlValues[key];
}

//Check if page content type match the parameter
//Sample Content Type Id = 0x0100BE6C2C36FFF60D418918C6E945776B81008DE373EA54600E4EACB20D61DF1BD17A
function CheckPageContentType(contentTypeID) {

    var urlValues = getUrlVars();
    if (urlValues.ContentTypeId == contentTypeID || urlValues.contenttypeid == contentTypeID) {
        return true;
    }
    return false
}


//Autocomplete function for search
function Autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    // console.log(inp.value);
                    filterCards(inp.value.toLowerCase());
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();

                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


// Convert an SVG image from url to an actual svg where you can adjust the styles
function ConvertSvgImgsToSVGElements(imgElement) {
    imgElement.each(function () {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        $.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');
            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });
}