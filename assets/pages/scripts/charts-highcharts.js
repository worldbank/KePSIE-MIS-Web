jQuery(document).ready(function() {
  // HIGHCHARTS DEMOS

  	// LINE CHART 1
	$('#highchart_1').highcharts({
        chart : {
             type: 'column',
            style: {
                fontFamily: 'Open Sans'
            }
        },
		title: {
			text: 'Health facilities by ownership',
			x: -20 //center
		},
	    credits: {
      enabled: false
  },

		xAxis: {
            title: {
                text: 'Public'
            },
			categories: ['Kakamega','Kilifi', 'Meru']
		},
		yAxis: {
			title: {
				text: 'Percentage'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		
		
		series: [{
			name: 'Public',
             color: '#1E2D53',
			data: [45.9,31.7,22.5]
		}, {
			name: 'Private',
            color: '#ADD8E6',
			data: [54.1,68.3,77.5]
		}]
	});


$('#highchart_2').highcharts({
        chart : {
             type: 'column',
            style: {
                fontFamily: 'Open Sans'
            }
        },
        title: {
            text: 'Health facilities by level',
            x: -20 //center
        },
        
        xAxis: {
            title: {
                text: 'Level'
            },
            categories: ['Kakamega','Kilifi', 'Meru']
        },
        yAxis: {
            title: {
                text: 'Percentage'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
         credits: {
      enabled: false
  },    
        
        series: [{
            name: 'Level 2',
             color: '#1E2D53',
            data: [75.6,84.1,89.1]
        }, {
              name: 'Level 3',
               color: '#EAF2F3',
            data: [19.0,11.7,7.1]
        },{
            name: 'Level 4',
             color: '#ADD8E6',
            data: [5.1,3.8,3.6]
        },
        {
            name: 'Level 5',
            color: '#19466E',
            data: [0.3,0.3,0.2]
        }  ]
    });
	
	

	
	$('#highchart_3').highcharts({
        chart: {
            type: 'column',
            style: {
                fontFamily: 'Open Sans'
            }
        },
        title: {
            text: 'Health facilities by size'
        },
        
        xAxis: {
            title: {
                text: 'Size'
            },
            categories: ['Kakamega','Kilifi', 'Meru']
        },
        yAxis: {
            title: {
                text: 'Percentage',

            },
             tickInterval: 20,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
         credits: {
      enabled: false
  },
        
       
     
        series: [{
            name: 'Category 1',
             color: '#1E2D53',
            data: [53.3,55.0,59.2]
        }, {
            name: 'Category 2',
            color: '#EAF2F3',
            data: [24.0,12.5,7.0]
        }, {
            name: 'Category 3',
             color: '#ADD8E6',
            data: [9.4,9.8,3.1]
        }, {
            name: 'Category 4',
            color: '#19466E',
            data: [0.3,0.5,0]
        }, {
            name: 'Category 5',
             color: '#81BFE8',
            data: [0.3,0.5,0]
        }, {
            name: 'Category 6',
             color: '#C5D2DE',
            data: [12.7,21.5,30.6]
        }]
    });
 
 	// BAR CHART
 	// Age categories
   
  
$('#highchart_4').highcharts({
        chart : {
             type: 'column',
            style: {
                fontFamily: 'Open Sans'
            }
        },
         credits: {
      enabled: false
  },
        title: {
            text: 'Average score by level',
            x: -20 //center
        },
         subtitle: {
            text: 'Percentage of Maximum Score',
            x: -20 //center
        },
        
        xAxis: {
            categories: ['Level 2','Level 3','Level 4','Level 5']
        },
        yAxis: {
            title: {
                text: 'Percentage of Maximum Score'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        
        
        series: [{
            showInLegend: false,
            data: [34.45,44.54,54.98,72.28]
        }]
    });
    
    
 



});
