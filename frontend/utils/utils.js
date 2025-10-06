export const base_url = `https://hunky-butler-backend.vercel.app/api`
// export const base_url = `http://localhost:5000/api`


  export const uploadToImgBB = async (file) => {
    try {

   if(!file){
    return null;
   }
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=08dd2c25fadca9984c9fe58a66d619e7`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();


    return data.data.url;
      
    } catch (error) {
      return error;
    }
  };




 

