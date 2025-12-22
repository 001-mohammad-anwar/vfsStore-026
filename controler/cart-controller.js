const userModel = require("../moddel/user-model");
const CartProductModel = require("../moddel/cartProduct-model");
const { default: mongoose } = require("mongoose");

const cartProductController = async (req, res) => {
  try {
    const userID = req.userID;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "provide product _id",
        success: false,
        error: true,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: new mongoose.Types.ObjectId(userID),
      productId: new mongoose.Types.ObjectId(productId),
    });


    if (checkItemCart) {
      return res.status(400).json({
        message: "Item already in your cart",
        success: false,
        error: true,
      });
    }

    const cartItem = new CartProductModel({
      productId: new mongoose.Types.ObjectId(productId),
      quantity: 1,
      userId: new mongoose.Types.ObjectId(userID),
    });

    const save = await cartItem.save();
    const updateCartUser = await userModel.updateOne(
      { _id: userID },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );

    return res.json({
      data: save,
      message: "item added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};


const getCartItemController = async(req , res) =>{
     try {
        
        const userId = req.userID
         
        const  cartItem = await CartProductModel.find({
            userId : userId
        }).populate("productId")

        return res.json({
            data : cartItem,
            error : false,
            success : true
        })

        
     } catch (error) {
        return res.status(500).json({
            message : error.message || message,
            error : true,
            success : false
        })
     }
}

const updateCartItemQty = async(req,res)=>{
        try {
            
            const userId = req.userID
            const {_id , quantity } = req.body
           
             if(!_id || !quantity){
                   return res.status(400).json({
                       message : "provide _id, qty"
                   })
             }

             const updateCartItem = await CartProductModel.updateOne({_id : _id, userId : userId },{
                quantity : quantity
             })
             console.log("updateCartItem",updateCartItem)

             return res.json({
                message : "updated cart",
                success : true,
                error : false,
                data : updateCartItem
             })
            
        } catch (error) {
              return res.status(500).json({
                message : error.message || message,
                success : false,
                error : true
              })
        }
}




const mergeGuestCart = async (req, res) => {
  try {
    const userId = req.userID;
    const { items } = req.body; 
    // items = [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.json({ success: true });
    }

    for (let item of items) {
      const existing = await CartProductModel.findOne({
        userId,
        productId: item.productId,
      });

      if (existing) {
        existing.quantity += item.quantity;
        await existing.save();
      } else {
        await CartProductModel.create({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    res.json({
      success: true,
      message: "Guest cart merged successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const DeleteCartItem = async(req,res)=>{
    try {

        const userId = req.userID  //it is comming from middleware
        const {_id} = req.body

        if(!_id){
            res.status(400).json({
                message : "provide _id",
                success : false,
                error : true
            })
        }

    const  deleteCartItem = await CartProductModel.deleteOne({ _id : _id , userId : userId });

    return res.json({
        message : "successfully item remove ",
        success : true,
        error : true,
        data : deleteCartItem
    })

        
    } catch (error) {
        return res.status(500).json({
            message : message.error || error ,
            success : false,
            error : true
        })
    }
     
}

module.exports = {
  cartProductController,
  getCartItemController,
  updateCartItemQty,
  DeleteCartItem,
  mergeGuestCart
};
