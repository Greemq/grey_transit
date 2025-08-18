<template>
  <input type="file" @change="handleFileChange" />
  <button @click="upload">Upload</button>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  setup() {
    const selectedFile = ref(null);

    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const upload = async () => {
      if (!selectedFile.value) return alert("Select a file");

      const formData = new FormData();
      formData.append("file", selectedFile.value);

      await axios.put("http://localhost:3001/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    };

    return {
      selectedFile,
      handleFileChange,
      upload,
    };
  },
};
</script>
