/**
* Route Mappings
* (sails.config.routes)
*
* Your routes map URLs to views and controllers.
*
* If Sails receives a URL that doesn't match any of the routes below,
* it will check for matching files (images, scripts, stylesheets, etc.)
* in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
* might match an image file: `/assets/images/foo.jpg`
*
* Finally, if those don't match either, the default 404 handler is triggered.
* See `api/responses/notFound.js` to adjust your app's 404 logic.
*
* Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
* flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
* CoffeeScript for the front-end.
*
* For more information on configuring custom routes, check out:
* http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
*/

module.exports.routes = {

/***************************************************************************
 *                                                                          *
 * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
 * etc. depending on your default view engine) your home page.              *
 *                                                                          *
 * (Alternatively, remove this and add an `index.html` file in your         *
 * `assets` directory)                                                      *
 *                                                                          *
 ***************************************************************************/


'/': {
  controller: 'UserController',
  action: 'login'
},

'/login': {
  controller: 'UserController',
  action: 'login'
},

'POST /authenticate': {
  controller: 'UserController',
  action: 'authenticate',
},

'/sendEmail': {
  controller: 'UserController',
  action: 'sendEmail'
},
'/changePassword':{
  controller: 'UserController',
  action: 'changePassword'
},

'/logout': {
  controller: 'UserController',
  action: 'logout'
},

//------Users------//
'/user/all' : {
  controller : 'UserController',
  action : 'usermanagement'
},

'/user/auditLogs' : {
  controller : 'UserController',
  action : 'auditLogs'
},

'/user/add' : {
  controller : 'UserController',
  action : 'addUser'
},

'/user/save' : {
  controller: 'UserController',
  action: 'saveUser'
},
'/user/update' : {
  controller: 'UserController',
  action: 'updateUser'
},

'/user/updateProfilePic':{
  controller: 'UserController',
  action: 'updateProfilePic'
},

'/user/list' : {
  controller: 'UserController',
  action: 'list'
},
'/auditTrail':{
  controller:'UserController',
  action:'auditTrail'
},

'post /user/delete' : {
  controller: 'UserController',
  action: 'delete'
},
'post /user/view' : {
  controller: 'UserController',
  action: 'view'
},
'post /user/viewlog' : {
  controller: 'UserController',
  action: 'viewlog'
},
'post /user/viewdata' : {
  controller: 'UserController',
  action: 'viewdata'
},
'post /user/edit' : {
  controller: 'UserController',
  action: 'edit'
},
'post /user/editdata' : {
  controller: 'UserController',
  action: 'editdata'
},
'POST /user/upload' : {
  controller: 'UserController',
  action: 'upload'
},
'post /user/profile' : {
  controller: 'UserController',
  action: 'profile'
},
'/user/changePassword' : {
  view:'user/changePassword'
},
'/user/updatePassword' : {
  controller: 'UserController',
  action: 'updatePassword'
},
'/user/incUpdatePassword' : {
  controller: 'UserController',
  action: 'incUpdatePassword'
},
'/user/checkEmail' :{
  controller: 'UserController',
  action: 'checkEmail'

},
//------Users------//
'/about': {
  controller: 'DashboardController',
  action: 'about'
},

'GET /dashboard': {
  controller: 'DashboardController',
  action: 'dashboard',
},
'POST /dashboard/exportAsPdf': {
  controller: 'DashboardController',
  action: 'exportAsPdf',
},
'GET /getFirstInspData': {
  controller: 'DashboardController',
  action: 'getFirstInspData',
},
'GET /getGraceRenewData': {
  controller: 'DashboardController',
  action: 'getGraceRenewData',
},
'GET /getNextInspData': {
  controller: 'DashboardController',
  action: 'getNextInspData',
},

//----Reports----//

//complete jhic reports routes
'GET /completejhic/individual/getFilterValues': {
  controller: 'CompleteJHICReportController',
  action: 'getFilterValues'
},
'GET /completejhic/individual': {
  controller: 'CompleteJHICReportController',
  action: 'individualReport'
},
/*'POST /completejhic/individual/emailReceiverList':{
  controller: 'CompleteJHICReportController',
  action: 'emailReceiverList'

},*/
'GET /completejhic/aggregate': {
  controller: 'CompleteJHICReportController',
  action: 'aggregateReport'
},
'GET /completejhic/individual/getData': {
  controller: 'CompleteJHICReportController',
  action: 'getIndividualList'
},
'POST /completejhic/individual/getInspectorNames': {
  controller: 'CompleteJHICReportController',
  action: 'getInspectorNames'
},
'GET /completejhic/individual/:id':{
  controller: 'CompleteJHICReportController',
  action: 'getIndividualReport'
},
'GET /completejhic/individualdetailed/:id':{
  controller: 'CompleteJHICReportController',
  action: 'getIndividualDetailedReport'
},
'POST /completejhic/individual/exportAsPdf':{
  controller : 'CompleteJHICReportController',
  action : 'exportIndividualAsPdf'
},
'POST /completejhic/aggregate/exportAsExcel':{
  controller : 'CompleteJHICReportController',
  action : 'exportAggregateAsExcel'
},
'POST /completejhic/aggregate/exportAsPDF':{
  controller : 'CompleteJHICReportController',
  action : 'exportAggregateAsPDF'
},

'POST /completejhic/individual/emailPdf':{
  controller : 'CompleteJHICReportController',
  action : 'mailIndividualAsPdf'
},

//trial

//finish
'POST /completejhic/aggregate/getData': {
  controller : 'CompleteJHICReportController',
  action : 'getAggregateList'
},
'POST /completejhic/aggregate/getDataByRisk': {
  controller : 'CompleteJHICReportController',
  action : 'getAggregateDataByRisk'
},

//summary jhic reports routes
'GET /summaryjhic/table':{
  controller: 'SummaryReportController',
  action: 'summaryReportTable'
},
'GET /summaryjhic/figure/getFilterValues':{
  controller: 'SummaryReportController',
  action: 'getFilterValues'
},
'GET /summaryjhic/figure':{
  controller: 'SummaryReportController',
  action: 'summaryReportFigure'
},
'GET /summaryjhic/map':{
  controller: 'SummaryReportController',
  action: 'summaryReportMap'
},
'POST /summaryjhic/map/exportAsKML': {
  controller: 'SummaryReportController',
  action: 'exportMapAsKML'
},
'POST /summaryjhic/figure/exportFigureAsPDF':{
  controller : 'SummaryReportController',
  action : 'exportFigureAsPDF'
},

'POST /summaryjhic/table/exportTableAsPDF': {
  controller: 'SummaryReportController',
  action: 'exportTableAsPDF'
},
'POST /summaryjhic/table/exportTableAsEXCEL': {
  controller: 'SummaryReportController',
  action: 'exportTableAsEXCEL'
},
'GET /summaryjhic/map/getData': {
  controller: 'SummaryReportController',
  action: 'getMapDataByFilter'
},
'POST /summaryjhic/figure/getData': {
  controller: 'SummaryReportController',
  action: 'getFigureDataByFilter'
},
'POST /summaryjhic/table/getData': {
  controller: 'SummaryReportController',
  action: 'getTableDataByFilter'
},

//inspection Progress and Planning routes start

'GET /aggregateProgress':{
  controller: 'InspectionProgressController',
  action: 'aggregateProgress'
},

'GET /facilityLevelProgress':{
  controller: 'InspectionProgressController',
  action: 'facilityLevelProgress'
},

'/facilityLevelProgress/figure/getData':{
  controller: 'InspectionProgressController',
  action: 'getFigureDataByFilter'
},
'POST /facilityLevel/figure/exportFigureAsPDF':{
  controller: 'InspectionProgressController',
  action: 'exportFigureAsPDF'
},

'GET /aggregateProgress/dataBank': {
 controller: 'InspectionPlanningController',
 action: 'aggregateProgressDatabank'
},

'POST /aggregateProgress/exportDatabank':{
 controller: 'InspectionPlanningController',
 action: 'aggregateProgressExportDatabank'
},


'GET /inspectionplanning/getFilterValues': {
  controller: 'InspectionPlanningController',
  action: 'getFilterValues'
},

'POST /inspectionProgressAndPlanning/getInspProgressDataByCounty': {
  controller: 'InspectionPlanningController',
  action: 'getInspProgressDataByCounty'
},

'GET /inspectorVisitPlan/dataBank':{
  controller: 'InspectionPlanningController',
  action: 'visitPlanDatabank'

},

'GET /inspectorVisitPlan/figure':{
  controller: 'InspectionPlanningController',
  action: 'visitPlanFigure'

},
'POST /visitPlan/getFigureData':{
  controller: 'InspectionPlanningController',
  action: 'getVisitPlanFigureData'

},
'POST /inspectionplanning/getFacilityList':{
  controller: 'InspectionPlanningController',
  action: 'getFacilityList'

},


'POST /inspectionplanning/getInspectorNames': {
  controller: 'InspectionPlanningController',
  action: 'getInspectorNames'
},

'POST /visitPlan/exportDatabank':{
  controller: 'InspectionPlanningController',
  action: 'exportDatabank'
},

'POST /visitPlan/exportDatabankPdf':{
  controller: 'InspectionPlanningController',
  action: 'exportDatabankPdf'
},

'POST /visitPlan/exportDatabankPdfMonthlyReport':{
 controller: 'InspectionPlanningController',
 action: 'exportDatabankPdfMonthlyReport'

},

'GET /inspectionplanning/map': {
  controller: 'InspectionPlanningController',
  action: 'inspectionPlanningMap'
},

'POST /inspectorVisitPlan/getVisitPlanMapData': {
  controller: 'InspectionPlanningController',
  action: 'getVisitPlanMapData'
},

'POST /visitPlan/map/exportAsKML': {
  controller: 'InspectionPlanningController',
  action: 'exportMapAsKML'
},
'GET /inspectionprogress/dataBank': {
  controller: 'InspectionProgressController',
  action: 'inspectionProgressDataBank'
},
'POST /progressAndAction/exportDatabank':{
  controller: 'InspectionProgressController',
  action: 'exportDatabank'

},



//inspection progress and planning routes end




//inspection progress routes

'GET /inspectionprogress/table/getFilterValues': {
  controller: 'InspectionProgressController',
  action: 'getTableFilterValues'
},

'POST /inspectionprogress/table/getAggregateData': {
  controller: 'InspectionProgressController',
  action: 'getAggregateTableData'
},






'POST /inspectionprogress/table/exportAsPDF': {
  controller: 'InspectionProgressController',
  action: 'exportTableAsPDF'
},
'GET /inspectionprogress/map': {
  controller: 'InspectionProgressController',
  action: 'inspectionProgressMap'
},

//inspection planning routes
'GET /inspectionplanning/table': {
  controller: 'InspectionPlanningController',
  action: 'inspectionPlannngTable'
},
'POST /inspectionplanning/table/getVisitPlanData': {
  controller: 'InspectionPlanningController',
  action: 'getVisitPlanData'
},
'POST /inspectionplanning/table/getInspProgressData': {
  controller: 'InspectionPlanningController',
  action: 'getInspProgressData'
},

'POST /inspectionplanning/table/exportAsPDF': {
  controller: 'InspectionPlanningController',
  action: 'exportAsPDF'
},
'POST /inspectionplanning/table/exportAsExcel': {
  controller: 'InspectionPlanningController',
  action: 'exportAsExcel'
},
'POST /inspectionplanning/inspectionPeriods': {
  controller: 'InspectionPlanningController',
  action: 'getInspectionPeriods'
},

'/ask/askExperts': {
 controller: 'AskExpertController',
 action: 'askExperts',
},
'/ask/newQuestion': {
 controller: 'AskExpertController',
 action: 'newQuestion',
},
'/ask/delete':{

  controller: 'AskExpertController',
  action: 'deleteQuestion',
},
'POST /ask/exportExcel':{
  controller: 'AskExpertController',
  action: 'exportExcel'
},
'/ask/query': {
 controller: 'AskExpertController',
 action: 'query',
},
'/ask/answer/:id': {
 controller: 'AskExpertController',
 action: 'answer',
},
'/ask/viewAnswer/:id': {
 controller: 'AskExpertController',
 action: 'viewAnswer',
},
'/ask/editQuery/:id': {
 controller: 'AskExpertController',
 action: 'editQuery',
},
'/ask/updateQuery':{
 controller: 'AskExpertController',
 action: 'updateQuery',
},
'/ask/deleteAnswer': {
 controller: 'AskExpertController',
 action: 'deleteAnswer',
},

'/ask/updateAnswer': {
 controller: 'AskExpertController',
 action: 'updateAnswer',
},

'/ask/queAnslist': {
 controller: 'AskExpertController',
 action: 'queAnslist',
},
'/ask/expertAnswer': {
 controller: 'AskExpertController',
 action: 'expertAnswer',
},
'/group/all': {
 controller: 'GroupDetailController',
 action: 'all',
},
'/group/list': {
 controller: 'GroupDetailController',
 action: 'list',
},
'/group/new': {
 controller: 'GroupDetailController',
 action: 'new',
},
'/group/create': {
 controller: 'GroupDetailController',
 action: 'create',
},
'/group/edit/:id': {
 controller: 'GroupDetailController',
 action: 'edit',
},
'/group/detail/:id': {
 controller: 'GroupDetailController',
 action: 'detail',
},
'/group/checkGroup' :{
  controller: 'GroupDetailController',
  action: 'checkGroup'

},
'/group/update': {
 controller: 'GroupDetailController',
 action: 'update',
},
'post /group/delete' : {
  controller: 'GroupDetailController',
  action: 'delete'
},
'/upload' : {
  controller: 'GroupDetailController',
  action: 'upload'
},


//----Reports----//
//----Health Facility Data Management----//

'GET /hf/all' : {
  controller : 'FacilityController',
  action : 'viewall'
},
'GET /hf/getFacilityList' : {
  controller : 'FacilityController',
  action : 'getFacilityList'
},

'POST /facility/checkId':{
 controller : 'FacilityController',
 action : 'checkId'
 
},

'POST /hf/uploaddata' : {
  controller : 'FacilityController',
  action : 'upload'
},
'POST /hf/uploadSignature' : {
  controller : 'FacilityController',
  action : 'uploadSignature'
},
'POST /hf/delete' : {
  controller : 'FacilityController',
  action : 'delete'
},
'GET /jhicdatabank' : {
  controller : 'JhicDataBankController',
  action : 'viewall'
},
'POST /exportDataBankList' : {
  controller : 'JhicDataBankController',
  action : 'exportDataBankList'
},

'POST /ask/checkForExpertGroup' : {
 controller : 'AskExpertController',
 action : 'checkForExpertGroup'

},

//facility closure

'GET /otherIssue':{

 controller : 'OtherIssuesController',
 action : 'otherIssue'

},

'POST /otherIssues/submit':{

 controller : 'OtherIssuesController',
 action : 'otherIssueSubmit'

},

'POST /otherIssues/checkId':{
 controller : 'OtherIssuesController',
 action : 'checkId'
 
},

'GET /otherIssue/summary':{
 controller : 'OtherIssuesController',
 action : 'summary'
 
},

'POST /otherIssues/list':{

 controller : 'OtherIssuesController',
 action : 'otherIssuesList'

},




'/faq':{
 controller : 'FAQController',
 action : 'faq'
},

'GET /faq/all' : {
  controller : 'FAQController',
  action : 'getFAQs'
},
'GET /faq/add' : {
  controller : 'FAQController',
  action : 'add'
},
'POST /faq/save' : {
  controller : 'FAQController',
  action : 'save'
},
'POST /faq/delete' : {
  controller : 'FAQController',
  action : 'delete'
},
'GET /faq/editdata/:id' : {
  controller : 'FAQController',
  action : 'editdata'
},
'GET /faq/edit' : {
  controller : 'FAQController',
  action : 'edit'
},
'POST /faq/update' : {
  controller : 'FAQController',
  action : 'update'
},
'GET /faq/import' : {
  controller : 'FAQController',
  action : 'import'
},
'POST /faq/import/saveall' : {
  controller : 'FAQController',
  action : 'importAll'
},

'POST /faq/import/save' : {
  controller : 'FAQController',
  action : 'importOne'
},

'POST /resources/upload' : {
  controller: 'ResourcesController',
  action: 'upload'
},

'POST /resources/newCategory':{

 controller: 'ResourcesController',
 action: 'newCategory'

},

'GET /resources':{

 controller : 'ResourcesController',
 action : 'resources'

},

'GET /resources/include/:id':{

 controller : 'ResourcesController',
 action : 'includeResources'

},

'GET /resources/categoryList':{
  controller : 'ResourcesController',
  action : 'categoryList'
},

'POST /resources/editCategory':{
  controller : 'ResourcesController',
  action : 'editCategory'

},

'POST /resources/deleteCategory':{
 controller : 'ResourcesController',
 action : 'deleteCategory'

},

'POST /resources/addSubList/:categoryId':{
 controller : 'ResourcesController',
 action : 'addSubList'

},

'POST /resources/categorySubList' :{
  controller : 'ResourcesController',
  action : 'categorySubList'

},
'POST /resources/deleteSubList' :{
  controller : 'ResourcesController',
  action : 'deleteSubList'

},
'GET /resources/categorySubList/:id':{
  controller : 'ResourcesController',
  action : 'userCategorySubList'
},

'POST /resources/checkCategory':{
 controller : 'ResourcesController',
 action : 'checkCategory'
},

'POST /resources/checkCategorySubList':{
 controller : 'ResourcesController',
 action : 'checkCategorySubList'

},

'POST /resources/editSubList/:id':{
  controller : 'ResourcesController',
  action : 'editCategorySubList'
},

'POST /resources/editSubListName/:id':{
  controller : 'ResourcesController',
  action : 'editCategorySubListName'
},

'POST /resources/editSubListLink/:id':{
  controller : 'ResourcesController',
  action : 'editSubListLink'
},

'GET /qualitychecks/figure/getFilterValues':{
 controller: 'QualityChecksController',
 action: 'getFilterValues'

},


'GET /qualitychecks/getFacilityList':{
  controller: 'QualityChecksController',
  action: 'getFacilityList'

},



'GET /qualitychecks/reports/figure':{
  controller: 'QualityChecksController',
  action: 'reportfigures'
},
'GET /qualitychecks/reports/table':{
  controller: 'QualityChecksController',
  action: 'reporttables'
},
'POST /qualitychecks/reports/table/getData': {
  controller: 'QualityChecksController',
  action: 'getTableDataByFilter'
},

'POST /qualitychecks/getQualityOfficersNames': {
  controller: 'QualityChecksController',
  action: 'getQualityOfficersNames'
},

'GET /qualitychecks/planning/figure':{
  controller: 'QualityChecksController',
  action: 'planningfigures'
},
'POST /qualitychecks/planning/getFigureData':{
  controller: 'QualityChecksController',
  action: 'getFigureData'
},

'GET /qualitychecks/planning/table':{
  controller: 'QualityChecksController',
  action: 'planningtables'
},
'GET /qualitychecks/planning/map':{
  controller: 'QualityChecksController',
  action: 'planningmaps'
},

'POST /qualitychecks/planning/mapdata': {
  controller: 'QualityChecksController',
  action: 'getVisitPlanMapData'
},

'POST /qualitychecks/planning/map/exportAsKML': {
  controller: 'QualityChecksController',
  action: 'exportMapAsKML'
},

'POST /qualitychecks/planning/exportDatabank':{
  controller: 'QualityChecksController',
  action: 'exportDatabank'
},

'POST /qualitychecks/planning/exportDatabankPdf':{
  controller: 'QualityChecksController',
  action: 'exportDatabankPdf'
},

'POST /qualitychecks/reports/getProgressDataByCounty': {
  controller: 'QualityChecksController',
  action: 'getProgressDataByCounty'
},
'POST /qualitychecks/table/getProgressData': {
  controller: 'QualityChecksController',
  action: 'getProgressData'
},

'POST /qualitychecks/reports/table/exportTableAsEXCEL':{
  controller: 'QualityChecksController',
  action: 'exportTableAsEXCEL'
},

'POST /qualitychecks/reports/table/exportTableAsPDF':{
  controller: 'QualityChecksController',
  action: 'exportTableAsPDF'
},
'GET /closure/table': {
  controller: 'FacilityClosureController',
  action: 'closureTable'
},
'GET /closure/figure': {
  controller: 'FacilityClosureController',
  action: 'closureFigure'
},
'POST /closure/exportExcel': {
  controller: 'FacilityClosureController',
  action: 'exportExcel'
},
'POST /closure/getGraceRenewData': {
  controller: 'FacilityClosureController',
  action: 'getGraceRenewData'
},
'POST /closure/getClosureStatus': {
  controller: 'FacilityClosureController',
  action: 'getClosureStatus'
}


/***************************************************************************
 *                                                                          *
 * Custom routes here...                                                    *
 *                                                                          *
 * If a request to a URL doesn't match any of the custom routes above, it   *
 * is matched against Sails route blueprints. See `config/blueprints.js`    *
 * for configuration options and examples.                                  *
 *                                                                          *
 ***************************************************************************/

};
