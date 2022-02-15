// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(480,430)
var frame_count=0;
var fram_name_array=new Array();
var namespcae="ExportCsdFile";
var key="my_tag"
const config={childList:true};
var nodes =figma.currentPage.findAllWithCriteria({types:["FRAME","GROUP"]});
var curren_count=nodes.length;
var last_count=curren_count;
var tag=0;
var layer_fram;
var node_type_array=[];
node_type_array[""]="未标记节点";
node_type_array["PanelObjectData"]="基础容器";
node_type_array["ListViewObjectData"]="列表容器";
node_type_array["PageViewObjectData"]="翻页容器";
node_type_array["ScrollViewObjectData"]="滚动容器";
node_type_array["ButtonObjectData"]="按钮";
node_type_array["CheckBoxObjectData"]="复选框";
node_type_array["ImageViewObjectData"]="图片";

//figma组件类型
var vessel_array=[];
var base_node_array=[];
vessel_array=["FRAME","GROUP","COMPONENT","INSTANCE"];
base_node_array=["RECTANGLE","LINE","VECTOR","STAR","POLYGON","ELLIPSE",]

//资源库
var res_lib;
//设置路径
var res_path="res_path";

GetAllFram(figma.currentPage);
//figma.ui.postMessage("1001:"+fram_name_array)
PostMessage(1001,fram_name_array);
GetTag();
figma.on("selectionchange", () => {GetTag() })








figma.ui.onmessage = msg => {

  if(msg.type=="res_lib")
  {
    res_lib=msg.value;
    //console.log(res_lib);
    
    
  }
  
  if(msg.type=="GetFrame")
  {
    PageChange();
  }
  if(msg.type=="MarkTab")
  {
    MarkTag(msg.value)
  }
  if(msg.type=="ExportFrame")
  {
    var csd_value="";
    if(figma.currentPage.selection[0]==null)
    {
      layer_fram=figma.currentPage.findOne(n => n.name === msg.value[0]);
    }
    else
    {
      layer_fram=figma.currentPage.selection[0];
    }
    layer_fram.setSharedPluginData(namespcae,"innersize_x",layer_fram.width.toString());
    layer_fram.setSharedPluginData(namespcae,"innersize_y",layer_fram.height.toString());

    csd_value+=CreateLayer(layer_fram,msg.value[1]);
   
    
    PostMessage(1003,csd_value);
    
    
  }
 
  
};
//figma.on("selectionchange", ()=>{PostMessage(1002,GetTag())})
//获取当前得到画布
function PageChange()
{
  
  if(figma.currentPage.findAllWithCriteria({types:["FRAME","GROUP"]}).length!=last_count)
  {
    
    frame_count=0;
    fram_name_array=new Array();
    GetAllFram(figma.currentPage);
    //figma.ui.postMessage("1001_"+fram_name_array)
    PostMessage(1001,fram_name_array)
    
    last_count=figma.currentPage.findAllWithCriteria({types:["FRAME","GROUP"]}).length
      
  }
}
//获取所有画布
function GetAllFram(figma_node)
{
  
  for(var child_node of figma_node.children)
  {
    if(child_node.type=="FRAME"||child_node.type=="GROUP")
    {
      
      if("name"in child_node&&child_node.name!=',')
      {
        fram_name_array[frame_count]=child_node.name;
        frame_count++;

      }
      
      

      

      if(child_node.children.length>0)
      {

        GetAllFram(child_node);
      
      }
    }
    
    
  }
  
}
//标记节点类型
function MarkTag(single)
{
  var new_single = single.split(',')
  for(var node of figma.currentPage.selection)
  {
    if(new_single[1]=="vessel")
    {
      MarkPanelTag(node,new_single[0])
    }
    else
    {
      if(new_single[0]=="ImageViewObjectData")
      {
        MarkImgTag(node,new_single[0])
      }
      if(new_single[0]=="ButtonObjectData")
      {
        MarkButtonTag(node,new_single[0])
      }

      
    }
    
   
    GetTag();
  }

}
//获取类型
function GetTag()
{
  var tag;

    if(figma.currentPage.selection.length>0)
    {
      tag = node_type_array[figma.currentPage.selection[0].getSharedPluginData(namespcae,key)];
    }
    if(tag==undefined)
    {
      tag="未选择节点"
    }
    PostMessage(1002,tag)

  
  

  
 
 // return tag;
}
function PostMessage(message_type,message)
{
  var content=message_type+":"+message;
  figma.ui.postMessage(content);
}





function GetGUId()
{
  var S4=function()
  {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return(S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4())+S4();

}


function GetActionTag(tag_count)
{
  var action_tag="";
  for(var i =0;i<tag_count;i++)
  {
    action_tag+=Math.floor(Math.random()*10);
  }
  return action_tag;

}

function GetProperty(Node)
{
  var node_action_array=[];
  node_action_array["PanelObjectData"]=8;
  node_action_array["ListViewObjectData"]=9;
  node_action_array["PageViewObjectData"]=9;
  node_action_array["ScrollViewObjectData"]=9;
  node_action_array["ImageViewObjectData"]=9;

  var property={
    //基础属性
    name:"",
    ctype:"",
    actiontag:"",
    clipAble:"",
    comboxindex:"",
    tag:"",
    backcoloralpha:"",
    tougchenable:" ",
    colorvector:"",
    single_color_total:"",
    first_color_total:"",
    end_color_total:"",
    color_angle:"",
    nine_scale_totle:"",
    nine_scale:{
      x:"1",
      y:"1"
    },
    margin:{
      top:"",
      right:"",
      left:"",
      bottom:""
    },
    size:{
      x:"",
      y:""
    },
    positon:{
      x:"",
      y:""
    },
    anchorPoint:{
      scaleX:0,
      scaleY:0,
      anchorpointvalue:""
      
    },
    preposition:{
      x:"",
      y:""
    },
    presize:{
      x:"",
      y:""
    },
    cccolor:{
  
      r:255,
      g:255,
      b:255
    },
    singlecolor:{
 
      r:255,
      g:255,
      b:255
    },
    firstcolor:{
    
      r:255,
      g:255,
      b:255
    },
    endcolor:{
      r:255,
      g:255,
      b:255,


    },
    tempsize:{
      x:0,
      y:0
    },
    //列表属性
    directiontype:"",
    itemMargin:"",
    layouttype:"",
    scrolldirectiontype:"",
    innernodesize:"",
    //图片路径
    img_res:"",


    
    
    

  }
  property.name=Node.name;
  property.ctype=Node.getSharedPluginData(namespcae,key);
  property.actiontag=GetActionTag(node_action_array[property.ctype])
  property.size.x=(Node.width).toFixed(4);
  property.size.y=(Node.height).toFixed(4);
  property.tempsize.x=Node.width;
  property.tempsize.y=Node.height;
  
  if(Node.getSharedPluginData(namespcae,"node_type")=="vessel")
  {
    property.nine_scale_totle=' Scale9Height="'+property.nine_scale.x+'" Scale9Width="'+property.nine_scale.y+'"'
    property.color_angle=' ColorAngle="90.0000"'
   if(Node.clipsContent===true)
   {
     property.clipAble=' ClipAble="True"'

   }

   property.colorvector='<ColorVector ScaleY="1.0000" />\n'
    property.anchorPoint.scaleX=0;
    property.anchorPoint.scaleX=0;
    if("fills" in Node)
    {
      if(Node.fills.length>0&&Node.fills[0].type=="SOLID") 
      {
        property.comboxindex=' ComboBoxIndex="1"'
      property.singlecolor.r=Math.ceil(Node.fills[0].color.r*255);
      property.singlecolor.g=Math.ceil(Node.fills[0].color.g*255);
      property.singlecolor.b=Math.ceil(Node.fills[0].color.b*255);
      property.single_color_total= '<SingleColor A="255" R="'+property.singlecolor.r+'" G="'+property.singlecolor.g+'" B="'+property.singlecolor.b+'" />\n'
      
     
      property.firstcolor.r=Math.ceil(Node.fills[0].color.r*255);
      property.firstcolor.g=Math.ceil(Node.fills[0].color.g*255);
      property.firstcolor.b=Math.ceil(Node.fills[0].color.b*255);
      property.first_color_total= '<FirstColor A="255" R="'+property.firstcolor.r+'" G="'+property.firstcolor.g+'" B="'+property.firstcolor.b+'" />\n'


      property.end_color_total= '<EndColor A="255" R="'+property.endcolor.r+'" G="'+property.endcolor.g+'" B="'+property.endcolor.b+'" />\n'

      if(Node.fills[0].opacity<1)
      {
        property.backcoloralpha=' BackColorAlpha="'+Node.fills[0].opacity*255+'"'
      }
      }
      
    }
    if(Node.getSharedPluginData(namespcae,key)=="ListViewObjectData")
    {
     
      property.tougchenable=' TouchEnable="True"'
      property.scrolldirectiontype=' ScrollDirectionType="0"'
      //如果没有开启自动布局
      if(Node.layoutMode=="NONE"||!("layoutMode" in Node))
      {
        
        property.directiontype=' DirectionType="Vertical"'
        if("children" in Node&&Node.children.length>0)
        {
          
          if(Node.children[1].x!=Node.children[0].x)
          {
            property.itemMargin=' ItemMargin="'+(Node.children[1].x-(Node.children[0].x+Node.children[0].width))+'"'
          }
          else
          {
            property.itemMargin=' ItemMargin="'+(Node.children[0].y-(Node.children[1].height+Node.children[1].y))+'"'
          }
        }
        
      }
      //如果开启自动布局
      else
      {
        property.directiontype=' DirectionType="'+Node.layoutMode+'"'
        property.itemMargin=' ItemMargin="'+Node.itemSpacing+'"'
        if(Node.layoutMode=="HORIZONTAL")
        {
          property.layouttype=' LayoutType="2"'

        }
        else
        {
          property.layouttype=' LayoutType="1"'

        }
        
        
        


      }
      

    }
    if(Node.getSharedPluginData(namespcae,key)=="PageViewObjectData")
    {
      property.tougchenable=' TouchEnable="True"'
      property.scrolldirectiontype=' ScrollDirectionType="0"'
      if(Node.layoutMode!="NONE"||("layoutMode" in Node))
      {
        
        if(Node.layoutMode=="HORIZONTAL")
        {
          property.layouttype=' LayoutType="2"'

        }
        else
        {
          property.layouttype=' LayoutType="1"'

        }

      }
    


    }
    if(Node.getSharedPluginData(namespcae,key)=="ScrollViewObjectData")
    {
      property.tougchenable=' TouchEnable="True"'
      
      if(Node.layoutMode=="NONE"||!("layoutMode" in Node))
      {
        //property.scrolldirectiontype=' ScrollDirectionType="Vertical"'
        if("children"in Node&&Node.children.length>0)
        {
          var last_node=Node.children[Node.children.length-1]

         // property.innernodesize='<InnerNodeSize Width="'+Math.ceil(Node.children[Node.children.length-1].x+Node.children[Node.children.length-1].width)+'" Height="'+Math.ceil(Node.children[Node.children.length-1].y+Node.children[Node.children.length-1].height)+'" />\n'
          if((last_node.x+last_node.width)>Node.width&&(last_node.y+last_node.height==Node.height))
          {
            property.scrolldirectiontype=' ScrollDirectionType="Horizontal"'
            property.innernodesize='<InnerNodeSize Width="'+Math.ceil(Node.children[Node.children.length-1].x+Node.children[Node.children.length-1].width)+'" Height="'+Math.ceil(Node.height)+'" />\n'

          }
          else if((last_node.x+last_node.width)==Node.width&&(last_node.y+last_node.height>=Node.height))
          {
            property.scrolldirectiontype=' ScrollDirectionType="Vertical"'
            property.innernodesize='<InnerNodeSize Width="'+Math.ceil(Node.width)+'" Height="'+Math.ceil(Node.children[Node.children.length-1].y+Node.children[Node.children.length-1].height)+'" />\n'
            property.tempsize.y=Node.children[Node.children.length-1].y+Node.children[Node.children.length-1].height;
          }
          else if((last_node.x+last_node.width)>Node.width)
          {
            property.scrolldirectiontype=' ScrollDirectionType="Vertical_Horizontal"'
            property.innernodesize='<InnerNodeSize Width="'+Math.ceil(Node.children[Node.children.length-1].x+Node.children[Node.children.length-1].width)+'" Height="'+Math.ceil(Node.children[Node.children.length-1].y+Node.children[Node.children.length-1].height)+'" />\n'
            //property.tempsize.x=Node.children[Node.children.length-1].x+Node.children[Node.children.length-1].width;

          }
          else
          {
            property.scrolldirectiontype=' ScrollDirectionType="Vertical"'

          }
          //布局类型
          if(Node.findChild(n=>n.x==Node.children[0].x)&&!Node.findChild(n=>n.y==Node.children[0].y))
          {
            property.layouttype=' LayoutType="2"'
          }
          else if(!Node.findChild(n=>n.x==Node.children[0].x)&&Node.findChild(n=>n.y==Node.children[0].y))
          {
            property.layouttype=' LayoutType="1"'
          }
        }
        else
        {
          property.innernodesize='<InnerNodeSize Width="'+Math.ceil(Node.width)+'" Height="'+Math.ceil(Node.height)+'" />\n'
          property.scrolldirectiontype=' ScrollDirectionType="Vertical"'
          
        }


      }
      else
      {
        property.scrolldirectiontype=' ScrollDirectionType="'+Node.layoutMode+'"'
          if(Node.layoutMode=="HORIZONTAL")
          {
          property.layouttype=' LayoutType="2"'

          }
          else
          {
          property.layouttype=' LayoutType="1"'

          }


      }
      //var deatil = JSON.parse(property.tempsize);

    }
    Node.setSharedPluginData(namespcae,"innersize_x",JSON.stringify(property.tempsize.x));
    Node.setSharedPluginData(namespcae,"innersize_y",JSON.stringify(property.tempsize.y));

  }
  else
  {
    property.anchorPoint.scaleX=0.5;
    property.anchorPoint.scaleY=0.5;
    property.anchorPoint.anchorpointvalue=' ScaleX="0.5000" ScaleY="0.5000"'
    if("fills" in Node)
    {
      if(Node.fills.length>0&&Node.fills[0].type=="SOLID")
      {
        property.cccolor.r=Math.ceil((Node.fills[0].color.r*255));
        property.cccolor.g=Math.ceil((Node.fills[0].color.g*255));
        property.cccolor.b=Math.ceil((Node.fills[0].color.b*255));
        if(Node.fills[0].opacity<1)
        {
          property.backcoloralpha=' Alpha="'+Node.fills[0].opacity*255+'"'
        }

      }
     
    
    }
    //图片

    var node_type= Node.getSharedPluginData(namespcae,key);
    if(node_type=="ImageViewObjectData")
    { 

      //console.warn(Node.getSharedPluginData(namespcae,res_path));
      if(Node.getSharedPluginData(namespcae,res_path)!==null)
      {
        property.img_res='<FileData Type="Normal" Path="'+Node.getSharedPluginData(namespcae,res_path)+'" Plist="" />\n';
      }
      else
      {
        property.img_res='<FileData Type="Default" Path="Default/ImageFile.png" Plist="" />\n';

      }

    } 
    
   
    

  }



  var parent_innersize = Node.parent.getSharedPluginData(namespcae,"innersize_x")+','+Node.parent.getSharedPluginData(namespcae,"innersize_y")
  var parent_size={
    x:0,
    y:0
  }

  parent_size.x=Number(parent_innersize.split(',')[0]);
  parent_size.y=Number(parent_innersize.split(',')[1]);
  
  

  if(Node.parent.type=="FRAME"||Node.parent.type=="INSTANCE")
  {
    property.positon.x=(Node.x+Node.width*property.anchorPoint.scaleX).toFixed(4);
    property.positon.y=(parent_size.y-(Node.y+Node.height*(1-property.anchorPoint.scaleY))).toFixed(4);
  }
  if(Node.parent.type=="GROUP")
  {
    
   
  
    property.positon.x=((Node.x-Node.parent.x)+Node.width*property.anchorPoint.scaleX).toFixed(4);
    property.positon.y=(parent_size.y-((Node.y-Node.parent.y)+property.tempsize.y*(1-property.anchorPoint.scaleY))).toFixed(4);
   
  }
  property.margin.top=(Number(property.positon.y)+(Node.height*(1-property.anchorPoint.scaleX))).toFixed(4)
  property.margin.bottom=(Number(property.positon.y)-(Node.height*(1-property.anchorPoint.scaleY))).toFixed(4)
  property.margin.left=(Number(property.positon.x)-(Node.width*(1-property.anchorPoint.scaleX))).toFixed(4);
  property.margin.right=(Number(property.positon.x)+(Node.width*(1-property.anchorPoint.scaleY))).toFixed(4);
  property.preposition.x=((Number(property.positon.x)/parent_size.x)*100).toFixed(4);
  property.preposition.y=((Number(property.positon.y)/parent_size.y)*100).toFixed(4);
  property.presize.x=((Node.width/parent_size.x)*100).toFixed(4);
  property.presize.y=((Node.height/parent_size.y)*100).toFixed(4);
  property.tag=(tag+=1).toString();
  return property;

}


function GetChild(Node)
{
  var child_value="";
  if("children" in Node)
  {
    var children= Node.children;
    if(children.length>0)
    {
      child_value="<Children>\n"
      for(var i=0;i<children.length;i++)
      {
        child_value+=CreateNode(children[i]);
      }
      child_value+="</Children>\n"
    }

  }
  
  return child_value;
  
  

}
function CreateNode(node)
{
  var pro = GetProperty(node)
  
  return'<AbstractNodeData Name="'+pro.name+'" ctype="'+pro.ctype+'" ActionTag="'+pro.actiontag+'"'+pro.backcoloralpha+' BottomMargin="'+
  pro.margin.bottom+'"'+pro.clipAble+pro.color_angle+pro.comboxindex+pro.directiontype+' IconVisible="False"'+pro.itemMargin+pro.layouttype+
  ' LeftMargin="'+pro.margin.left+'" RightMargin="'+pro.margin.right+'"'+pro.nine_scale_totle+pro.scrolldirectiontype+' Tag="'+pro.tag+'" TopMargin="'+pro.margin.top+'"'+pro.tougchenable+'>\n'+
  '<Size X="'+pro.size.x+'" Y="'+pro.size.y+'" />\n'+
  GetChild(node)+
  '<AnchorPoint'+pro.anchorPoint.anchorpointvalue+' />\n'+
  '<Position X="'+pro.positon.x+'" Y="'+pro.positon.y+'" />\n'+
  '<Scale ScaleX="1.0000" ScaleY="1.0000" />\n'+
  '<CColor A="255" R="'+pro.cccolor.r+'" G="'+pro.cccolor.g+'" B="'+pro.cccolor.b+'" />\n'+
  '<PrePosition X="'+pro.preposition.x+'" Y="'+pro.preposition.y+'" />\n'+
  '<PreSize X="'+pro.presize.x+'" Y="'+pro.presize.y+'" />\n'+
  pro.img_res+
  pro.single_color_total+
  pro.first_color_total+
  pro.end_color_total+
  pro.colorvector+
  pro.innernodesize+
  '</AbstractNodeData>\n'

}
function CreateLayer(Frame_Node,file_name)
{
 
  
  return "<GameFile>\n"+
  '<PropertyGroup Name='+'"'+file_name+'"'+" Type="+'"'+"Layer"+'"'+" ID="+'"'+GetGUId()+'"'+" Version="+'"'+"2.3.3.0"+'"'+' />'+"\n"+
  "<Content ctype="+'"'+"GameProjectContent"+'"'+">\n"+
  "<Content>\n"+
  "<Animation Duration="+'"'+0+'"'+" Speed="+'"'+"1.0000"+'"'+" />\n"+
  "<ObjectData Name="+'"'+"Layer"+'"'+" ctype="+'"'+"GameLayerObjectData"+'"'+" Tag="+'"'+(tag+=1)+'"'+">\n"+
  "<Size X="+'"'+Frame_Node.width.toFixed(4)+'"'+" Y="+'"'+Frame_Node.height.toFixed(4)+'"'+" />\n"+
  GetChild(Frame_Node)+
  "</ObjectData>\n"+
  "</Content>\n"+
  "</Content>\n"+
  "</GameFile>";

}









//标记节点类型

//标记容器类型
function MarkPanelTag(Node,Node_type)
{
  
    if("clipsContent" in Node )
    {
      Node.setSharedPluginData(namespcae,key,Node_type);
      Node.setSharedPluginData(namespcae,"node_type","vessel");
    }
    
}

function MarkImgTag(Node,Node_type)
{
  if(vessel_array.indexOf(Node.type)!=-1)
  {
    if(Node.children.length==1&&base_node_array.indexOf(Node.children[0].type)!=-1)
    {
      Node.setSharedPluginData(namespcae,"node_type","vessel");
      Node.setSharedPluginData(namespcae,key,"PanelObjectData");
      Node.children[0].setSharedPluginData(namespcae,"node_type","node");
      Node.children[0].setSharedPluginData(namespcae,key,Node_type);
      if("fills" in Node.children[0]&&Node.children[0].fills[0].type=="IMAGE")
      {
        
        Node.children[0].setSharedPluginData(namespcae,res_path,res_lib[Node.children[0].fills[0].imageHash])
      }

     
    }
  }
  else if(base_node_array.indexOf(Node.type)!=-1)
  {
    Node.setSharedPluginData(namespcae,"node_type","node");
    Node.setSharedPluginData(namespcae,key,Node_type);
    if("fills" in Node&&Node.fills[0].type=="IMAGE")
    {
      
        Node.setSharedPluginData(namespcae,res_path,res_lib[Node.fills[0].imageHash])
    }
  }

}

function MarkButtonTag(Node,Node_type)
{
  
  //单图片
  if(base_node_array.indexOf(Node.type)!=-1)
  {
    Node.setSharedPluginData(namespcae,"node_type","node");
    Node.setSharedPluginData(namespcae,key,Node_type);
  }
  //被容器包起来的并且有其他节点
  if(vessel_array.indexOf(Node.type)!=-1)
  {
    const img = GetTheMaxImg(Node);
    var MarkChildTag=function(_Node)
    {
      for(const node of _Node.children)
      {
       
        if(vessel_array.indexOf(node.type)!=-1)
        {
          node.setSharedPluginData(namespcae,"node_type","vessel");
          node.setSharedPluginData(namespcae,key,"PanelObjectData");
        }
        else if(base_node_array.indexOf(node.type)!=-1)
        {
          node.setSharedPluginData(namespcae,"node_type","node");
          node.setSharedPluginData(namespcae,key,"ImageViewObjectData");
        }

        if("children" in node)
        {
          MarkChildTag(node);
        }
      }
    }
    MarkChildTag(Node);
    img.locked=true;
    Node.setSharedPluginData(namespcae,"node_type","node");
    Node.setSharedPluginData(namespcae,key,Node_type);
    // if(Node.type=="INSTANCE"&&Node.mainComponent.parent.type=="COMPONENT_SET")
    // {

    //   //console.warn(Node.type);
    //   var length = Node.mainComponent.parent.variantGroupProperties["Property 1"].values.length;
    //   // console.warn(Object.keys(Node.mainComponent.parent.variantGroupProperties)[0]);
    //   for(var i =0;i<length;i++)
    //   {
    //     console.warn(Node.mainComponent.parent.children[i].name);
    //   }
    // }
    
    
    

  }

}
function GetTheMaxImg(Node)
{
  var max_img = Node.children[0];
    var GetChild=function(_Node){
      for(const node of _Node.children)
      {
        if(((node.width>max_img.width)&&(node.height>max_img.height))&&base_node_array.indexOf(node.type)!=-1)
        {
          max_img=node
        }
        if("children" in node)
        {
          GetChild(node);
        }
      }
      return max_img;
    }
   
    if(Node.children.length>1)
    {
      return  GetChild(Node);
    }
    return max_img;
    
}