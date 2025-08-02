import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import 'laravel-echo';

// Base API config
const api = 'http://127.0.0.1:8000/api';
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const toast = useToast();

// Computer functions
export const useComputerStore = defineStore('computer', () => {
  const computers = ref([]);
  const labs = ref([]);
  const isLoading = ref(false);
  const modal = ref(false);
  const tagValue = ref('');


  const toast = useToast();

  // const listenToComputerEvents = () => {
  //   window.echo.channel('computers')
  //     .listen('.ComputerStatsEvent', (e) => {

  //       const updateComputer = event;

  //       const index = computers.value.findIndex(computer => computer.id === updateComputer.id);
  //       if (index !== -1) {
  //         computers.value[index].is_online = updateComputer.is_online;
  //         computers.value[index].is_lock = updateComputer.is_lock;
  //       }else{
  //         computers.value.push(updateComputer);
  //       }
  //       toast.info(`Computer (${updatedComputer.ip_address}) is now ${updatedComputer.is_online ? 'online' : 'offline'}`);
  //     });
  // }

  const fetchComputers = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(`${api}/computers`, getAuthHeader());
      computers.value = response.data.computers || [];
    } catch (error) {
      computers.value = [];
      toast.error('Failed to fetch computers');
      console.error('Error fetching computers:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchLabs = async () => {
    try {
      const response = await axios.get(`${api}/laboratories`, getAuthHeader());
      labs.value = response.data.laboratories || [];
    } catch (error) {
      labs.value = [];
      toast.error('Failed to fetch labs');
      console.error('Error fetching labs:', error);
    }
  };

  const storeComputer = async (data) => {
    try {
      const response = await axios.post(`${api}/computers`, data, getAuthHeader());
      toast.success(response.data.message || 'Computer added successfully!');
      await fetchComputers();
    } catch (error) {
      toast.error('Failed to add computer.');
      console.error('Error storing computer:', error);
    }
  };

  const updateComputer = async (id, data) => {
    try {
      await axios.put(`${api}/computers/update/${id}`, data, getAuthHeader());
      toast.success('Computer updated successfully!');
      await fetchComputers();
    } catch (error) {
      toast.error('Failed to update computer.');
      console.error('Error updating computer:', error);
    }
  };

  const deleteComputer = async (id) => {
    try {
      await axios.delete(`${api}/computers/${id}`, getAuthHeader());
      toast.success('Computer deleted successfully!');
      await fetchComputers();
    } catch (error) {
      toast.error('Failed to delete computer.');
      console.error('Error deleting computer:', error);
    }
  };

  const unlockComputer = async (id, rfid_uid) => {
    try {
      const response = await axios.put(
        `${api}/computer/state/${id}`,
        { rfid_uid },
        getAuthHeader()
      );
      
      toast.success(response.data.message || 'Computer unlocked successfully!');
      console.log(response.data.message);
      await fetchComputers();
      return true;
    } catch(error) {
      toast.error(error.response?.data?.message || 'Failed to unlock computer.');
      console.error(error);
      return false;
    }
  }

  return {
    computers,
    labs,
    isLoading,
    modal,
    fetchComputers,
    fetchLabs,
    storeComputer,
    updateComputer,
    deleteComputer,
    unlockComputer,
  };
});

// Students functions
export const useStudentStore = defineStore('student', () => {
  const students = ref([]);
  const isLoading = ref(false);

  const storeStudent = async (data) => {
    try{
      const response = await axios.post(`${api}/students`, data, getAuthHeader());
      toast.success(response.data.message || 'Student added successfully!');
    }catch(error){
      toast.error('Failed to add student.');
      console.error('Error storing student:', error);
    }
  }

  const fetchStudents = async (page = 1) => {
    try{
      isLoading.value = true;
      const response = await axios.get(`${api}/students?page=${page}`, getAuthHeader());
      students.value = response.data.students || [];
      console.log(students.value);
      
    }catch(error){
      students.value = [];
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    }finally{
      isLoading.value = false;
    }
  }

  const updateStudent = async (id, data) => {
    try{
      await axios.put(`${api}/students/${id}`, data, getAuthHeader());
      toast.success('Student updated successfully!');
      await fetchStudents();
    }catch(error){
      toast.error('Failed to update student.');
      console.error('Error updating student:', error);
    }
  }

  const deleteStudent = async (id) => {
    try{
      await axios.delete(`${api}/students/${id}`, getAuthHeader());
      toast.success('Student deleted successfully!');
      await fetchStudents();
    }catch(error){
      toast.error('Failed to delete student.');
      console.error('Error deleting student:', error);
    }
  }

  return{
    students,
    isLoading,
    storeStudent,
    fetchStudents,
    updateStudent,
    deleteStudent,
  }

});

// Program functions
  export const useProgramStore = defineStore('program', () => {
    const programs = ref([]);

    const fetchPrograms = async () => {
      try{
        const response =  await axios.get(`${api}/programs`, getAuthHeader());
        programs.value = response.data.programs || [];
        console.log(programs.value);
      }catch(error){
        programs.value = [];
        toast.error('Failed to fetch programs');
        console.error('Error fetching programs:', error);
      }
    };
  
    return {
      programs,
      fetchPrograms,
    };
  });
  
  // Computer log functions
  export const useComputerLogStore = defineStore('computerLog', () => {
    const computerLogs = ref({
      data: [],
      meta: {}
    });
    const isLoading = ref(false);

    const fetchComputerLogs = async (page = 1) => {
      try{
        const response = await axios.get(`${api}/logs?page=${page}`, getAuthHeader());
        computerLogs.value = response.data.computer_logs || [];
        console.log(computerLogs.value);
      }catch(error){
        computerLogs.value = [];
        toast.error('Failed to fetch computer logs');
        console.error('Error fetching computer logs:', error);
      
      }
    }

    return{
      computerLogs,
      isLoading,
      fetchComputerLogs,
    }
  });

  // Excel Import function
  export const useExcelStore = defineStore('excel', () =>{
      const isImportModalOpen = ref(false);
      const selectedFile = ref(null);
      const isDragOver = ref(false);
      const fileInput = ref(null);
      const isLoading = ref(false);

      const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if(file){
          selectedFile.value = file;
        }
      };

      const handleDrop = (event) => {
        isDragOver.value = false;
        const file = event.dataTransfer.files[0];
        if(file && file.name.endsWith('.xlsx') || file.name.endsWith('.xls')){
          selectedFile.value = file;
        }else{

        }
      };

      const removeFile = () => {
        selectedFile.value = null;
        if(fileInput.value){
          fileInput.value.value = '';
        
        }
      };

      const importStudents = async () => {
        if(selectedFile.value){
          toast.error('Please select a file first');
        return;
        }

        isLoading.value = true;

        try {
          const data = await readExcelFile(selectedFile.value);
          const students = parseExcelData(data);

          for(const student of students){
            await useStudentStore().storeStudent(student);
          }
          toast.success('Students imported successfully!');
          isImportModalOpen.value = false;
          selectedFile.value = null;
        } catch (error) {
          toast.error('Failed to import students.');
          console.error('Error importing students:', error);
        }finally{
          isLoading.value = false;
        }
      }

      const readExcelFile = async (file) => {
        return new Promise((resolve, reject) =>{
          const reader = new FileReader();

          reader.onload = (event) => {
            try{
              const data = new Uint8Array(event.target.result);
              const workbook = XLSX.read(data, {type: 'array'});
              const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
              const jsonData = XLSX.utils.sheet_to_json(firstSheet);
              resolve(jsonData);
            }catch(error){
              reject(error);
            
            }
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsArrayBuffer(file);
        });
      };

      const parseExcelData = (excelData) => {
        return excelData.map(row => ({
          rfid_uid: row['RFID_UID'] || row['rfid_uid'],
          student_id: row['Student_ID'] || row['student_id'],
          first_name: row['First_Name'] || row['first_name'],
          middle_name: row['Middle_Name'] || row['middle_name'],
          last_name: row['Last_Name'] || row['last_name'],
          email: row['Email'] || row['email'],
        })).filter(student => student.first_name && student.last_name);
      };


      return{
        isImportModalOpen,
        selectedFile,
        isDragOver,
        fileInput,
        isLoading,
        handleFileUpload,
        handleDrop,
        removeFile,
        importStudents,
        readExcelFile,
        parseExcelData,
      }

  });

