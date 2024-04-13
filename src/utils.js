
export const isJsonString = (data)=>{
    try {
      JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOption = (arr)=>{
  let result = []
    if(arr){
      result = arr?.map((item)=> {
        return {
          value: item,
          label: item
        }
      }
      )
      
    }
    
    return result
}

export const convertPrice = (price)=>{
  try {
    const results = price?.toLocaleString().replaceAll(',','.')
    return   `${results} đ`
  } catch (error) {
      return null;
  }
}