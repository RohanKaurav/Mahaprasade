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
    
    bottomButtonContainer: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        
      },
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
        borderRadius:"40%",
        justifyContent:'center',
        alignContent:'center',
    },
    imgBlock:{
        marginTop:10,
        borderWidth:'0.5px',
        padding:20,
        borderRadius:'20px',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        borderColor:'#007bff',
        
    },
    vendorName:{
        justifyContent:'center',
        alignContent:'center',
        textAlign:'center',
        marginTop:'10px',
        fontFamily:'Roman'
    },
    addButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
})
export default styles;