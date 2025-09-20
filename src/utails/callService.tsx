//axios
// import axios from 'axios';



const apiCall = async (service: () => Promise<void>) => {
  try {
    await service();
  } catch (error) {
    console.error('Error calling service:', error);
  }
};
export default apiCall;