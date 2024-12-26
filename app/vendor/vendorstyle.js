import {StyleSheet} from 'react-native';
 const styles=StyleSheet.create({
    bdy:{
          flex:1,
           width: "100%", // Ensures full width
          padding:"10px",
          margin:5,
          paddingBottom:'15px',
          borderColor: "black",
          borderWidth: 0,
          borderTopStartRadius: 10,
          borderTopEndRadius: 10,
          padding: 10,
          borderBottomWidth:'0px',
        
        
    },
   
    contnt:{
         flex: 1,
        height:"100vh",
        alignItems: 'center',
        justifyContent:'center', 
    },
    // menu:{
    //     display:'flex',
    //      flexDirection:'row',
    //     flex:1,
    //     justifyContent:'center',
    //     width: "100%",
    //     fontFamily:'Times New Roman, Times, serif',
    //     fontSize:'25px',
       
    // },
    list:{
        flexDirection:"row",
        flex:1,
        width:'100%',
        minHeight:100,
        fontFamily:"sans serif",
        padding:"5px",
        marginTop:'0px',
        marginBottom:'0px',
        borderColor:'grey',
        borderWidth:.25,
        borderLeftWidth:'0px',
        borderRightWidth:'0px',
        // borderRadius:'5px',
        paddingRight:'0',

       
    },
    buttn:{
        flexDirection: 'row', 
        alignItems: 'center',
        //justifyContent: 'flex-end', // Pushes content to the right
        borderWidth:'2px',
        borderColor:'grey',
        borderRadius:10,
        padding:'10px',
        // paddingHorizontal: 10,
        marginLeft:5,
        marginBottom:'3px',
        marginRight:'3px',
        
       
    },
    
    btn_pls:{
       backgroundColor:'none',
       marginBottom:'2px',
       marginLeft:"5px",
       fontWeight:'bold',
       fontSize:20,
       color:'green',
       alignItems: 'center',
       justifyContent:'center', 
       
    },
    btn_mns:{
        backgroundColor:'none',
        color:'red',
        fontWeight:'bold',
        fontSize:20,
        marginRight:"5px",
        alignItems: 'center',
        justifyContent:'center', 
        padding:'2px',
    },
    addbtn:{
        borderRadius:"5px",
        padding:'2px',
        marginRight:'2px',
        fontSize:30,
        alignItems: 'center',
        justifyContent:'center', 
        fontWeight:'bold',
        
    },
    img:{
        width: 200, 
        height: 200,
        borderWidth:'2px',
        borderColor:'grey',
        borderRadius:"50%",
    },
    imgBlock:{
        marginTop:10,
        borderWidth:'0.5px',
        padding:20,
        borderRadius:'20px',
        // backgroundColor:'hsl(287, 100%, 70%)',
    },
    vendorName:{
        justifyContent:'center',
        alignContent:'center',
        textAlign:'center',
        marginTop:'10px',
        fontFamily:'Roman'
    },
})
export default styles;