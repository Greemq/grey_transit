import axios from "axios";

export function uploadFile(formData) {
  return axios
    .put("http://localhost:3001/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
}
