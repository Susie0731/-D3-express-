

// // load data
fetch('http://127.0.0.1:8080/all_values')
    .then(res => res.json())
      .then(jsonData => {
        console.log(jsonData)
    d3.csv('../data/tianjin/values.csv', function(values) {
    d3.csv('../data/map.csv', function(map) { 
    d3.csv('../data/locations.csv', function(locations){
      d3.csv('../data/location-coord.csv', function(coord) {
        for (var i = 0; i < locations.length; i++) {
          var found = false;
          for (var j = 0; j < coord.length; j++) {
            if (coord[j].id === locations[i].id) {
              found = true;
              locations[i].x = coord[j].x;
              locations[i].y = coord[j].y;
              break;
            }
          }
          if (!found) {
            // no coord for this location, remove
            locations.splice(i, 1);
            i--;
          }
        }
        d3.select('#loading')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove();

        var data = {
          all_values:jsonData,
          values:values,
          map:map,
          locations:locations,
        }
        console.log(data.map);
        begin(data);
        
    }
  )})
  }  
)})
});

function begin (data){

  //预处理数据
  var data = (function () {
    // prepare data
    data.byStation = d3.nest().key(function(d) {
      return d.place;
    }).entries(data.values);
    console.log(data.byStation);

    return data;
  })();

  //画标尺图 闭包
  var drawBar = (function(){

    var dy = 30;
    var maplegend = d3.select('svg.map').attr('width','510,2')
    .attr('height','485.2').append('g').attr('class','legend').attr('transform',"translate(15,20)");

    var legendData = [
        {
            value:15,
            desc:'most polluated',
        },
        {
            value:13,
            desc:' '
        },
        {
            value:11,
            desc:' ',
        },
        {
            value:9,
            desc:" ",
        },
        {
            value:7,
            desc:"least polluated",
        },
    ];

    return function(){
      maplegend.selectAll('circle.legend-element')
    .data(legendData)
    .enter()
    .append('circle')
    .attr('class','legend-element').attr('cx',50)
    .attr('cy',function(d,i){
        return dy*i;
    })
    .attr('r',function(d){
        return d.value;
    }).attr('fill','rgb(158, 202, 225)')
    ;

    maplegend.selectAll('text.legend-element')
    .data(legendData).enter().append('text')
    .attr('class','legend-element')
    .attr('x',80)
    .attr('y',function(d,i){
        return i*dy;
    })
    .attr('dy','.375em')
    .text(function(d){
        return d.desc;
    });

    }
    

  })();

  drawBar();

  //画地图 回调
  // function drawmap(callback) {
  //   var map = {};
  //   var margin = {
  //     top: 5,
  //     right: 5,
  //     bottom: 5,
  //     left: 5
  //   };
  //   var ratio = 0.73;
  //   var width = 700 * ratio;
  //   var height = 1000 * ratio;

  //   var mapsvg = d3.select("svg.map").attr("width",width+margin.left+margin.right)
  //   .attr("height",height+margin.bottom+margin.top)
  //   .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr("weight","511").attr("height","475");

  //   let projection = d3.geo.mercator()
  //   .center([116.4, 40.1])
  //   .scale(17000)
  //   .translate([-5, 5])
    

  //   let path = d3.geo.path()
  //   .projection(projection)

  //   d3.json("../data/china-geojson/geometryProvince/12.json",function(geojson){
  //   mapsvg.append("path")
  //   .attr("class","map active")
  //       .attr("d", path(geojson))
  //       .attr('fill', 'rgb(222,235,247)')
  //       .attr('opacity','0.4')
  //       .attr("stroke","rgb(8,48,107)")
  //       .attr("stroke-width", 0.5);
  //   });
  //   callback();
  // };

    function drawcircle(){
      var ratio = 0.6;
      var mapsvg = d3.select("svg.map")

  //     //画半径
      var radiusrange= [3,7]
     
      var radius = d3.scale.linear().domain([55,72])
        .range(radiusrange);
       console.log(data.values);
      
       var averagePolluted = d3.nest().key(function(d){
         return d.place;
       }).rollup(function(v){
         return d3.mean(v,function(d){
           return d.pm2_5;
         })
       }).entries(data.values);

       console.log(averagePolluted);
       console.log(data.byStation);
       console.log(data.locations);
       console.log(radius(100));

       //更新地名
       //更新地名
    var selectStation = function(d){
      d3.select('#station-name').remove();
      d3.select("h2").remove();
      d3.select('#station').append('h2')
      .text(d);
    }
    


    //更新图表
    var changeBar = function(d){
    //   var dataset2 = [233 , 145 , 446 , 4 , 90,100,100];
    //   d3.select("#station")
    // .selectAll("rect")                    
    // .data(dataset2)                   
    // .transition()                            
    // .duration(1000)
    // .attr("height", (d) => d)
    // .attr('y',function(d,i){
    //   return 300-d;
    // }) 
    var rectdata = function(d){
      var rectdata = [];
      for( var i = 0;i<d.length;i++){
        rectdata.push(parseInt(d[i].pm2_5));
      }
      return rectdata;
    }  
      var placedata = d3.nest().key(function(d){
        return d.place;
      }).entries(data.values);
       console.log(placedata[2].key); 
       console.log(rectdata(placedata[1].values));

      for (var i = 0;i<placedata.length;i++){
        if(parseInt(d) === parseInt(placedata[i].key)){
          
          d3.select("#station").selectAll('rect')
          .data(rectdata(placedata[i].values))
          .transition()                            
          .duration(1000)
          .attr('height',(d)=>d)
          .attr('y',function(d){
            return 300-d;
          }) 
          console.log('sucuesss') ;
        }
        else continue;
      }
    };

    var backBar = function(){
      // var dataset2 = [233 , 145 , 446 , 4 , 90,100,100];
      d3.select("#station")
    .selectAll("rect")                    
    .data(data.all_values)                   
    .transition()                            
    .duration(1000)
    .attr("height", (d) => d)
    .attr('y',function(d,i){
      return 300-d.pm2_5;
    }) 
    };
       //修改半径大小以及点击修改柱状图数据
      mapsvg.selectAll('.locations').data(data.locations).enter().append('circle')
    .attr('class','locations').attr('cx',function(d){
      return d.x*ratio;
    })
    .attr('cy',function(d){
      return d.y*ratio;
    })
    .attr('r',function(d){
      var len = averagePolluted.length;
      for (var i = 0;i<len;i++){
          if(d.id ==averagePolluted[i].key){
            return radius(averagePolluted[i].values);
          }
      }
    })
    .attr('fill','#9ecae1')
    .attr('opacity','0.4')
    .on('click',function(d){
      deletecolor();
      selectStation(d.full_name);
      changeBar(d.id);
      d3.select(this).attr('fill','#0570b0').attr('border-style','solid').attr('border-width','5px');
      console.log('print success');
    }).on('mouseover',function(){
      d3.select(this).attr('fill','#3690c0');
    }).on('mouseout',function(){
      d3.selectAll(this).attr('fill','#9ecae1');
    });


    var deletecolor = function(){
      d3.selectAll('circle').attr('fill','#9ecae1');
    }
    //点击地图其他位置恢复原状
    // mapsvg.on('click',function(){
    //   backBar();
    // })
    
    
     //鼠标移上去变色

      //获得表格
      var locations = document.getElementsByClassName("locations");
      for (var i = 0; i < locations.length; i++) {
          //鼠标进来事件：把行变成粉色色
          locations[i].onmouseover = function () {
              this.fill = "pink";
          };
          //鼠标离开事件：把行取消粉色
          locations[i].onmouseout = function () {
            this.fill = "#9ecae1";
          };
      }

      

  };
    

  //  drawmap(drawcircle);

  //promise实现circle
   let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
        var flag = false;
        var map = {};
    var margin = {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    };
    var ratio = 0.73;
    var width = 700 * ratio;
    var height = 1000 * ratio;

    var mapsvg = d3.select("svg.map").attr("width",width+margin.left+margin.right)
    .attr("height",height+margin.bottom+margin.top)
    .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr("weight","511").attr("height","475");

    let projection = d3.geo.mercator()
    .center([116.4, 40.1])
    .scale(17000)
    .translate([-5, 5])
    

    let path = d3.geo.path()
    .projection(projection)

    d3.json("../data/china-geojson/geometryProvince/12.json",function(geojson){
    mapsvg.append("path")
    .attr("class","map active")
        .attr("d", path(geojson))
        .attr('fill', 'rgb(222,235,247)')
        .attr('opacity','0.4')
        .attr("stroke","rgb(8,48,107)")
        .attr("stroke-width", 0.5);
    });
      flag = true;
      console.log('flag:'+flag);
      if(flag){
        resolve();
      }
      else reject();
    });

  myFirstPromise.then(function(){
      //successMessage的值是上面调用resolve(...)方法传入的值.
      //successMessage参数不一定非要是字符串类型，这里只是举个例子
      console.log('sussseee');
      drawcircle();
  },function(error){
    console.log('failure');
  });





   var gap = 1;
    var tileWidth = (width - axisWidth) / 24 - gap;
    var tileHeight = (height - axisHeight) / 14 - gap;
    var width = 418;
    var height = 155;
    var axisHeight = 15;
    var axisWidth = 20;

    console.log(data.locations);

   //画tiles

  //  console.log(data.values);
  //  (function(){
  //  mapsvg = d3.select('svg.map');
  //  mapsvg.selectAll('.tile').data(data.values).enter().append('rect')
  //  .attr('class', 'tile')
  //  .attr('width', tileWidth)
  //  .attr('height', tileHeight)
  //  .attr('rx', 3)
  //  .attr('ry', 1)
  //  .attr('x', 30)
  //  .attr('y', 30);
  //  })();

   //画柱状图
   (function(){
     
    
    var maxPM2_5 = function(d){
      var max = 0;
      for( var i = 0;i<d.length;i++){
          if(d[i].pm2_5>max)
            max=d[i].pm2_5;
      }
      return max;
    };

    console.log(data.all_values[1]);

    var dataset = [50, 43, 120, 87, 99, 167, 142];  // 数据集

    var width = 500;    // svg可视区域宽度
    var height = 400;   // svg可视区域高度
    var svg = d3.select("#station")
            .append("svg")
            .attr("width", width).attr("height", height).attr("transform", "translate( 5,-50)");
  
    var padding = {top: 20, right: 20, bottom: 20, left: 50};   // 边距

    svg.selectAll('rect').data(data.all_values)
        .enter().append('rect')
        .attr('class','bar')
        .attr("height",function(d){
          return d.pm2_5;
        }).attr('width','30')
        .attr('x',function(d,i){
          return (i*40+60);
        }).attr('y',function(d,i){
          return 300-d.pm2_5;
        }).attr('fill','rgb(158,202,225)').on("mouseover",function(d,i){
          d3.select(this)
              .attr("fill","rgb(107,174,214");
      }).on("mouseout",function(d,i){
        d3.select(this)
            .attr("fill",'rgb(158,202,225)');
    })
;

    // svg.selectAll('text').data(data.all_values)
    // .enter().append('text').text(function(d){
    //   return d.pm2_5;
    // }).attr('x',function(d,i){
    //   return (i*40+60);
    // }).attr('y',function(d,i){
    //   return 298-d.pm2_5;
    // }).attr('fill','#737373');

    var item = function (data){
        var items = [];
        for(var i = 0;i<data.length;i++){
          items.push(data[i].time);
        }
        return items;
    }
    //坐标轴
    var xp = d3.scale.ordinal().domain(item(data.all_values)
    ).rangeRoundBands([0,width-padding.left-padding.right-144.5]);
    var yp = d3.scale.linear().domain([0,180])
            .range([230,0]);
    var xAxis = d3.svg.axis().scale(xp).orient('bottom');
    var yAxis = d3.svg.axis().scale(yp).orient('left');

    svg.append('g').attr('class','xAxis')
    .attr("transform","translate("+padding.left+","+(height-padding.bottom-80)+")")
    .call(xAxis);
    svg.append('g').attr('class','yAxis')
    .attr("transform","translate("+(padding.right+30) +","+(padding.top+56)+")")
    .call(yAxis).append('fill','black');

   })();
    
};

// connection.end();