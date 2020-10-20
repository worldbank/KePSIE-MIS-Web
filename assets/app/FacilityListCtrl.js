var fModule = angular.module("facilityModule", ['ngMessages']);
var hfLevelData = [];
var scope;
var oTable = null;
var http = null;

fModule.controller("facilityController", function($scope, $http) {


    var d = new Date();
    /*  $('#fromDateV').val('01-01-'+d.getFullYear());
      $('#toDateV').val((parseInt(d.getDate()))+'-'+(parseInt(d.getMonth())+1)+'-'+d.getFullYear());
      */
    $scope.inspectors = [];
    http = $http;
    scope = $scope;
    bindDatePickers();


    scope.hfLevelFilterChanges = function() {
        hfLevelFilterChanges1();
    };

    scope.hfLevelCountyChanges = function() {
        populateInspectors(hfLevelFilterChanges1);
    }

    scope.resetAll = function() {

        $("#dateValidation").hide();
        $('#fromDate').val("All");
        $('#toDate').val("All");
        $('#fromDateV').val("");
        $('#toDateV').val("");
        $("#generalSearchText").val("");

        scope.selectCounty = scope.counties[0];
        populateInspectors(hfLevelFilterChanges1);

    }

    populateCounties(populateInspectors);

    function populateCounties(callback) {
        http({
            method: "GET",
            url: routesPrefix + "/completejhic/individual/getFilterValues",
        }).then(function mySucces(response) {
            scope.counties = response.data.countyList;
            subCountyList = response.data.subCountyList;
            subCountyList = JSON.parse(subCountyList);
            scope.selectCounty = scope.counties[0];

            callback(initTable);
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function populateInspectors(callback) {
        //populate inspector names dropdown
        http({
            method: "POST",
            url: routesPrefix + "/completejhic/individual/getInspectorNames",
            data: {
                county: scope.selectCounty
            }
        }).then(function mySucces(response) {
            $scope.inspectors = response.data.inspectors;
            console.log("length");
            console.log("$scope.inspectors : " + $scope.inspectors.length);
            if ($scope.inspectors.length == 0) {

                $scope.inspectors.unshift({ name: "All", _id: "All" });
                $scope.selectedInspector = $scope.inspectors[0];

            } else {
                if ($scope.inspectors.length >= 1)
                    $scope.inspectors.unshift({ name: "All", _id: "All" });
                $scope.selectedInspector = $scope.inspectors[0];

            }

            callback();
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function bindDatePickers() {
        var d = new Date();

        $('#fromDate').daterangepicker({
            // autoUpdateInput: false,
            singleDatePicker: true,
            showDropdowns: true,
            locale: { format: 'DD-MM-YYYY' },
            maxDate: new Date(),
        });

        $('#fromDate').on('apply.daterangepicker', function(ev, picker) {
            $('#fromDateV').val(picker.startDate.format('DD-MM-YYYY'));
            var fr = $('#fromDateV').val().split('-');
            var startDt = fr[2] + "/" + fr[1] + "/" + fr[0];

            var to = $('#toDateV').val().split('-');
            var toDt = to[2] + "/" + to[1] + "/" + to[0];

            if (new Date(startDt).getTime() > new Date(toDt).getTime()) {

                $("#dateValidation").show();
                //  $scope.dateValidation=true;
            } else {

                $("#dateValidation").hide();
            }
            hfLevelFilterChanges1();
        });

        $('#toDate').daterangepicker({
            //autoUpdateInput: false,
            singleDatePicker: true,
            showDropdowns: true,
            locale: { format: 'DD-MM-YYYY' },
            maxDate: new Date(),
        });

        $('#fromDate').val("All");
        $('#toDate').val("All");

        $('#toDate').on('apply.daterangepicker', function(ev, picker) {
            $('#toDateV').val(picker.startDate.format('DD-MM-YYYY'));
            var fr = $('#fromDateV').val().split('-');
            var startDt = fr[2] + "/" + fr[1] + "/" + fr[0];

            var to = $('#toDateV').val().split('-');
            var toDt = to[2] + "/" + to[1] + "/" + to[0];

            if (new Date(startDt).getTime() > new Date(toDt).getTime()) {

                $("#dateValidation").show();
                //  $scope.dateValidation=true;
            } else {

                $("#dateValidation").hide();
            }

            hfLevelFilterChanges1();
        });

        $('#fromDate').attr('readonly', true);
        $('#toDate').attr('readonly', true);
    }

    function initTable() {

        oTable = $('#hfLevelReportTable').DataTable({
            destroy: true,
            "bServerSide": true,
            "pagingType": "numbers",
            "bAutoWidth": false,
            "sDom": 'lrtip',
            "sAjaxSource": routesPrefix + "/hf/getFacilityList",
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "county", "value": $("#countyDropdown").val() }, { "name": "generalSearchText", "value": $("#generalSearchText").val() }, { "name": "fromDate", "value": $("#fromDateV").val() }, { "name": "toDate", "value": $("#toDateV").val() }, { "name": "inspector", "value": scope.selectedInspector });
            },
            "bAutoWidth": false,
            "bProcessing": true,
            "lengthMenu": [
                [10, 25, 50, -1],
                [10, 25, 50, "All"]
            ],
            "iDisplayLength": 10,
            "order": [
                [3, 'desc']
            ],
            "aoColumns": [{
                    "mData": "_county",
                    'className': 'dt-body-center',
                    width: '10%',
                    "defaultContent": ""
                },
                { "mData": "_hfname", 'className': 'dt-body-center', width: '25%', "defaultContent": "" },
                { "mData": "p_insp_number", 'className': 'dt-body-center', "defaultContent": "", width: '10%' },
                { "mData": "_inspectorname", 'className': 'dt-body-center', "defaultContent": "", width: '20%' },
                {
                    "mData": "_date",
                    'className': 'dt-body-center',
                    "defaultContent": "",
                    width: '10%',
                    "render": function(data) {
                        console.log(data);
                        if (data != undefined) {
                            var date = new Date(data);
                            var month = date.getMonth() + 1;
                            var dt = date.getDate();
                            return (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();
                        } else {
                            return ""
                        }
                    }
                },
                {
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                    "mData": "_id",
                    "defaultContent": "",
                    width: '10%',
                    mRender: function(data, type, row) {
                        // return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary" href="#deleteConfirmation" title="Delete">Delete</a></div></div>';
                        return '<div class="actionsDiv"><div  class="actionDiv"><a  class="actionDiv deletepopupclass deleteUser btn btn-primary" href="#"  onclick="angular.element(this).scope().delete(\'' + row._id + '\')"    data-toggle="modal" title="Delete">Delete</a></div></div>';


                    }
                }
            ],
        });
    }
    var ids;
    $scope.delete = function(id) {
        ids = id;

        $(".deleteUser").attr("href", "#deleteConfirmation");

    }

    $scope.deleteFacility = function() {

        var data = { id: ids };
        $http.post(routesPrefix + '/hf/delete', data).success(function(data) {

            window.location.href = routesPrefix + "/hf/all";
        });
    }



    $scope.uploadCSV = function(uploadCSVForm) {

        if (uploadCSVForm.$invalid) {

            $scope.submitted1 = true;
            return;
        } else {
            if ($scope.csvFile != undefined) {
                $scope.submitted1 = false;


                if ($scope.csvFile.name.split('.').pop().toLowerCase() == "csv") {

                    $.showLoading({ allowHide: true });


                    var file = $scope.csvFile;
                    console.log(file);
                    console.log("file is ");
                    console.dir(file);
                    console.log($scope.csvFile.name);

                    $('#stack1').modal('hide');

                    var path = $scope.csvFile.name;
                    var uploadUrl = routesPrefix + "/hf/uploaddata";
                    var pth;

                    var fd = new FormData();
                    fd.append('file', file);
                    console.log("fd");
                    console.log(fd);
                    $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        })
                        .success(function(res) {
                            console.log("res here");
                            console.log(res);

                            if (res.flag == 1) {
                                $('#fileMsg').show();
                                $('#fileMsg').delay(10000).fadeOut(10000);
                            } else {
                                $('#fileMsgErr').show();
                                $('#fileMsgErr').delay(10000).fadeOut(10000);
                            }


                            $("#file_title1").empty();



                            $scope.csvFile = undefined;

                            $scope.fileType1 = false;
                            window.location.href = routesPrefix + "/hf/all";

                        });
                } else {
                    $scope.fileType1 = true;
                }
            } else {
                $scope.submitted1 = true;
            }

        }
    }

    $scope.uploadSignature = function(uploadSignatureForm) {

        console.log($scope.myFile);

        if (uploadSignatureForm.$invalid) {

            $scope.submitted = true;
            return;
        } else {
            if ($scope.myFile != undefined) {
                $scope.submitted = false;
                if ($scope.myFile.name.split('.').pop().toLowerCase() == "zip")


                {

                    var file = $scope.myFile;
                    console.log(file);
                    console.log("file is ");
                    console.dir(file);
                    console.log($scope.myFile.name);

                    var path = $scope.myFile.name;
                    var uploadUrl = routesPrefix + "/hf/uploadSignature";
                    var pth;

                    var fd = new FormData();
                    fd.append('file', file);
                    console.log("fd");
                    console.log(fd);
                    $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        })
                        .success(function(res) {

                            $('#stack2').modal('hide');
                            $('#scanMsg').show();
                            $('#scanMsg').delay(1000).fadeOut(3000);
                            $("#file_title").empty();
                            $scope.myFile = undefined;

                            $scope.fileType = false;

                        });
                } else {
                    $scope.fileType = true;
                }
            } else {
                $scope.submitted = true;
            }

        }
    }

    /*

      var d = new Date();
      $('#fromDateV').val('01-01-'+d.getFullYear());
      $('#toDateV').val((parseInt(d.getDate()))+'-'+(parseInt(d.getMonth())+1)+'-'+d.getFullYear());
      $scope.inspectors = [];
      http = $http;
      scope = $scope;
      initTable();






      function initTable() {

        oTable=$('#facilityTable').DataTable({
            "bServerSide": true,
            "sAjaxSource":routesPrefix+"/hf/getall",

            "bAutoWidth": false,
            "bProcessing": true,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "iDisplayLength": 10, 
            "order": [[3, 'desc']],
            "aoColumns": [
            { "mData": "_hfid",'className': 'dt-body-center', width:'10%',   },

            { "mData": "_hfname",'className': 'dt-body-center', width:'25%' },
            { "mData": "_inspectorid",'className': 'dt-body-center', width:'20%' },
            { "mData": "_inspectorname",'className': 'dt-body-center', width:'10%'},
            { "mData": "_county",'className': 'dt-body-center', width:'10%'},
            {'targets': 0,
            'searchable': false,
            'orderable': false,
            'className': 'dt-body-center',
            "mData":"_id",
            "width":'17%',
            mRender: function ( data, type, row ) {
                return  '<div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary" href="'+routesPrefix+'/completejhic/individualdetailed/'+row._id+'" title="Delete">Delete</a></div></div>';

            }
        }
        ],
    }); 
    }
    */


});



function hfLevelFilterChanges1() {
    oTable.ajax.reload();
}