const AddressModel = require('../moddel/address-model')

const UserModel = require('../moddel/user-model')

const addAddressController = async(req, res)=>{

    try {
        const userId  = req.userID
        const {address_line , city , state ,  pincode , country , mobile} = req.body

        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId : userId
            
        })

        const saveAddress = await createAddress.save()
        const addUserAddressId = await UserModel.findByIdAndUpdate(userId , {
            $push : {
                address_details : saveAddress._id
            }
        })

        return res.json({
            message : "Address Created Successfully",
            error : false,
            success : true,
            data : saveAddress


        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

const getAddressController = async(req,res)=>{
    try {
        const userId = req.userID
        const data = await AddressModel.find({userId : userId}).sort({ createdAt : -1 })
        return res.json({
            data : data,
            message : "List of Address",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true ,
            success : false
        })
    }
}


const updateAddressController = async(req,res)=>{
    try {
          
        const userId = req.userID  //this will come from the middleware 
        console.log(req.body)
         const {_id , address_line , city , state , country , pincode , mobile } = req.body

         const updateAddress = await AddressModel.updateOne({_id : _id , userId : userId  },{
            address_line,
            city,
            state,
            country,
            mobile,
            pincode 
         })

         return res.json({
            message : " update data successfully ",
            success : true,
            error : false,
            data : updateAddress

         })
        
    } catch (error) {
        return res.status(500).json({
             message : error.message || error,
             success : false ,
             error : true
        })
    }
}

const deleteAddressController = async(req, res)=>{
    try {
        const userId = req.userID   // which is comming from authMiddleware
        const { _id } = req.body

        const dissableAddress = await AddressModel.updateOne({ _id : _id , userId },{
               status : false
        })

        return res.json({
            message : "Address remove",
            error : false,
            success : true,
            data : dissableAddress

        })
    } catch (error) {
        return res.status(500).json({
             message : error.message || error,
             error : true,
             success  : false,
         

        })
        
    }
}



module.exports = {addAddressController , getAddressController , updateAddressController, deleteAddressController}
