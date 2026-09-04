const User =require("../models/user");
const bcrypt=require("bcrypt")

//جلب المستخدمين 
const getAllUsers= async(req,res)=>{
    try{
    // نستخدم attributes لتحديد الحقول المراد إرجاعها فقط
  // هذا يمنع إرسال بيانات حساسة مثل كلمة المرور
  const users = await User.findAll({
    attributes:["id","firstName","lastName","email","phone","isBlocked","createdAt"]

  });
   res.status(200).json(users);

    }catch(err){
        res.status(500).json({message:err.message});

    }
};


//IDجلب مستخدم محدد بال
const getUserById =async(req,res) =>{
    try{
         const user = await User.findByPk(req.params.id,{
            attributes:["id","firstName","lastName","email","role","createdAt",]
        })
       // التحقق إذا لم يوجد المستخدم
    if (!user) return res.status(404).json({ message: "user is not fund" });

    // إرسال بيانات المستخدم
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role } = req.body;

    // 🔐 إنشاء كلمة مرور تلقائية
    const generatedPassword = crypto.randomBytes(8).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      role,
      password: generatedPassword,
      isPasswordSet: false,
    });

    res.status(201).json({
      message: "User created successfully",
      temporaryPassword: generatedPassword,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  };


//تحديث بيانات المستخدم الحالي (Profile Update) باستخدام بيانات التوكن وليس ID من الرابط.

//يعني: المستخدم يعدل حسابه هو فقط، وليس حساب أي شخص آخر.
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, email, password, phone } = req.body;

       // 🔒 إذا المستخدم أرسل كلمة مرور جديدة
    // يتم تشفيرها قبل الحفظ
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
       // ✏️ تحديث الحقول فقط إذا كانت موجودة (لو لم تُرسل لا يتم تغييرها)
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

    // جلب بيانات المستخدم الحالي (من التوكن)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "email", "role", "phone"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
      message: "User fetched successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const changePassword = async (req,res)=>{
  try{

    const user = await User.findByPk(req.user.id);

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }


    const {
      currentPassword,
      newPassword
    } = req.body;


    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );


    if(!isMatch){

      return res.status(400).json({
        message:"validation.currentPasswordWrong"
      });

    }


    user.password = newPassword;

    await user.save();


    res.json({
      message:"validation.passwordChanged"
    });


  }catch(err){

    console.log(err);

    res.status(500).json({
      message:err.message
    });

  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      password
    } = req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;

    // 🔐 إذا الأدمن أرسل كلمة سر جديدة
    if (password !== undefined && password !== "") {
      user.password = password;
    }

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      message: "User updated successfully",
      user: userResponse,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports ={getAllUsers,getUserById,getCurrentUser,createUser
    ,updateUser,changePassword,updateUserByAdmin,toggleBlockUser}


