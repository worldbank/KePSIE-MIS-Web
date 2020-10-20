var srModule = angular.module("completeJHICIndividualListModule", []);
var hfLevelData = [];
var scope;
var oTable = null;
var http = null;

srModule.controller("completeJHICIndividualListController", function ($scope, $http) {
    var d = new Date();
    $('#fromDateV').val('01-11-2016');
    $('#toDateV').val((parseInt(d.getDate()))+'-'+(parseInt(d.getMonth())+1)+'-'+d.getFullYear());
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

    populateCounties(populateInspectors);
    
    function populateCounties(callback) {
        http({
            method: "GET",
            url: routesPrefix+"/completejhic/individual/getFilterValues",
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
            url: routesPrefix+"/completejhic/individual/getInspectorNames",
            data: {
                county : scope.selectCounty
            }
        }).then(function mySucces(response) {
            $scope.inspectors = response.data.inspectors;
            console.log("length");
            console.log("$scope.inspectors : "+$scope.inspectors.length);
            if($scope.inspectors.length==0) {
                $scope.selectedInspector = {name:"",_id:"",name:""};
            } else {
                if($scope.inspectors.length>1)
                    $scope.inspectors.unshift({name:"All",_id:"All",name:"All"});
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
        singleDatePicker: true,
        showDropdowns: true,
        startDate: '01-11-2016',
        locale: {format: 'DD-MM-YYYY'},
         maxDate: new Date(),
         opens: 'right'
    });
    $('#fromDate').on('apply.daterangepicker', function(ev, picker) {
      $('#fromDateV').val(picker.startDate.format('DD-MM-YYYY'));
        var fr=$('#fromDateV').val().split('-');
        var startDt=fr[2]+"/"+fr[1]+"/"+fr[0];

         var to=$('#toDateV').val().split('-');
        var toDt=to[2]+"/"+to[1]+"/"+to[0];

       if(new Date(startDt).getTime() > new Date(toDt).getTime()){
      
        $("#dateValidation").show();
      //  $scope.dateValidation=true;
      }else{
       
         $("#dateValidation").hide();
      }
      hfLevelFilterChanges1();
    });

    $('#toDate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {format: 'DD-MM-YYYY'},
         maxDate: new Date(),
         opens: 'left'
    });
    $('#toDate').on('apply.daterangepicker', function(ev, picker) {
      $('#toDateV').val(picker.startDate.format('DD-MM-YYYY'));
        var fr=$('#fromDateV').val().split('-');
        var startDt=fr[2]+"/"+fr[1]+"/"+fr[0];

         var to=$('#toDateV').val().split('-');
        var toDt=to[2]+"/"+to[1]+"/"+to[0];

      if(new Date(startDt).getTime() > new Date(toDt).getTime()){
      
        $("#dateValidation").show();
      //  $scope.dateValidation=true;
      }else{
        
         $("#dateValidation").hide();
      }
        
      hfLevelFilterChanges1();
    });
    
    $('#fromDate').attr('readonly', true);
    $('#toDate').attr('readonly', true);
}

function initTable() {

    oTable=$('#hfLevelReportTable').DataTable({
        "bServerSide": true,
        "pagingType": "numbers",
        "sDom": 'lrtip',
        "sAjaxSource":routesPrefix+"/completejhic/individual/getData",
        "fnServerParams": function ( aoData ) {
            aoData.push( { "name": "county", "value": $("#countyDropdown").val() },
                        { "name": "generalSearchText", "value": $("#generalSearchText").val() },
                        { "name": "fromDate", "value": $("#fromDateV").val() },
                        { "name": "toDate", "value": $("#toDateV").val() },
                      { "name": "inspector", "value":scope.selectedInspector });
        },  
        "bAutoWidth": false,
        "bProcessing": true,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "iDisplayLength": 10, 
        "order": [[3, 'desc']],
        "aoColumns": [
            { "mData": "_hfid",'className': 'dt-body-center', width:'8%', "defaultContent":"" },
            { "mData": "_county",'className': 'dt-body-center', width:'10%', "defaultContent":"" },     
            { "mData": "_hfname",'className': 'dt-body-center', width:'22%', "defaultContent":""  },
            { "mData": "p_insp_number",'className': 'dt-body-center', width:'5%', "defaultContent":"" },
            { "mData": "_inspectorname",'className': 'dt-body-center', width:'15%', "defaultContent":""  },
            { "mData": "_date",'className': 'dt-body-center', width:'10%', "defaultContent":"" ,
            "render": function (data) {
                console.log(data);
                var date = new Date(data);
                var month = date.getMonth() + 1;
                var dt=date.getDate();
                return (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();
            } },
            { "mData": "_insp_type",'className': 'dt-body-center', width:'8%', "defaultContent":"",

                mRender: function ( data, type, row ) {
                    var text="";
                    if(data>=101 && data<=200){
                        var insp = data-100;
                        text="Routine inspection ("+insp+")"
                    }else if(data==201){
                        text= "HF license verification";
                    }else if(data==202){
                        text=  "Department license verification";
                    }else if(data==203){
                        text=  "HF score/category revision";
                    }else if(data==300){
                        text= "Reinspection for quality issues & complaints"; 
                    }else if(data==800){
                        text= "Department-only inspection"; 
                    }

                    return  text;

                } 
            },
            {'targets': 0,
                'searchable': false,
                'orderable': false,
                'className': 'dt-body-center',
                "mData":"_id",
                "defaultContent":"" ,
                width:'19%',
                mRender: function ( data, type, row ) {
                    return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary" href="'+routesPrefix+'/completejhic/individual/'+row._id+'" title="Overview and By Unit">Overview</a></div>' +
                            '<div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary" href="'+routesPrefix+'/completejhic/individualdetailed/'+row._id+'" title="Complete JHIC">Complete</a></div></div>';

                }
            }
        ],
    }); 
}
});

function hfLevelFilterChanges1() {
    oTable.ajax.reload();
}

