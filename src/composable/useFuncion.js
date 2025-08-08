import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Add this import
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

// Students functions
// export const useStudentStore = defineStore('student', () => {
//   const students = ref([]);
//   const isLoading = ref(false);

//   const storeStudent = async (data) => {
//     try{
//       const response = await axios.post(`${api}/students`, data, getAuthHeader());
//       toast.success(response.data.message || 'Student added successfully!');
//     }catch(error){
//       toast.error('Failed to add student.');
//       console.error('Error storing student:', error);
//     }
//   }
//   const fetchStudents = async (page = 1) => {
//     try{
//       isLoading.value = true;
//       const response = await axios.get(`${api}/students?page=${page}`, getAuthHeader());
//       students.value = response.data.students || [];
//       console.log(students.value);
      
//     }catch(error){
//       students.value = [];
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     }finally{
//       isLoading.value = false;
//     }
//   }

//   const updateStudent = async (id, data) => {
//     try{
//       await axios.put(`${api}/students/${id}`, data, getAuthHeader());
//       toast.success('Student updated successfully!');
//       await fetchStudents();
//     }catch(error){
//       toast.error('Failed to update student.');
//       console.error('Error updating student:', error);
//     }
//   }

//   const deleteStudent = async (id) => {
//     try{
//       await axios.delete(`${api}/students/${id}`, getAuthHeader());
//       toast.success('Student deleted successfully!');
//       await fetchStudents();
//     }catch(error){
//       toast.error('Failed to delete student.');
//       console.error('Error deleting student:', error);
//     }
//   }

//   return{
//     students,
//     isLoading,
//     storeStudent,
//     fetchStudents,
//     updateStudent,
//     deleteStudent,
//   }

// });

// // Program functions
//   export const useProgramStore = defineStore('program', () => {
//     const programs = ref([]);

//     const fetchPrograms = async () => {
//       try{
//         const response =  await axios.get(`${api}/programs`, getAuthHeader());
//         programs.value = response.data.programs || [];
//         console.log(programs.value);
//       }catch(error){
//         programs.value = [];
//         toast.error('Failed to fetch programs');
//         console.error('Error fetching programs:', error);
//       }
//     };
  
//     return {
//       programs,
//       fetchPrograms,
//     };
//   });
  
  // Computer log functions
  // export const useComputerLogStore = defineStore('computerLog', () => {
  //   const computerLogs = ref({
  //     data: [],
  //     meta: {}
  //   });
  //   const isLoading = ref(false);

  //   const fetchComputerLogs = async (page = 1) => {
  //     try{
  //       const response = await axios.get(`${api}/logs?page=${page}`, getAuthHeader());
  //       computerLogs.value = response.data.computer_logs || [];
  //       console.log(computerLogs.value);
  //     }catch(error){
  //       computerLogs.value = [];
  //       toast.error('Failed to fetch computer logs');
  //       console.error('Error fetching computer logs:', error);
      
  //     }
  //   }

  //   return{
  //     computerLogs,
  //     isLoading,
  //     fetchComputerLogs,
  //   }
  // });

  // Excel Import function
  // export const useExcelStore = defineStore('excel', () =>{
  //     const std = useStudentStore();
  //     const isImportModalOpen = ref(false);
  //     const selectedFile = ref(null);
  //     const isDragOver = ref(false);
  //     const fileInput = ref(null);
  //     const isLoading = ref(false);

  //     const handleFileUpload = (event) => {
  //       const file = event.target.files[0];

  //       if(file){
  //         selectedFile.value = file;
  //       }
  //     };

  //     const handleDrop = (event) => {
  //       isDragOver.value = false;
  //       const file = event.dataTransfer.files[0];
  //       if(file && file.name.endsWith('.xlsx') || file.name.endsWith('.xls')){
  //         selectedFile.value = file;
  //       }else{

  //       }
  //     };

  //     const removeFile = () => {
  //       selectedFile.value = null;
  //       if(fileInput.value){
  //         fileInput.value.value = '';
        
  //       }
  //     };

  //     const importStudents = async () => {
  //       if (!selectedFile.value) {
  //         toast.error('Please select a file first');
  //         return;
  //       }

  //       isLoading.value = true;

  //       try {
  //         const data = await readExcelFile(selectedFile.value);
  //         const students = parseExcelData(data);

  //         const response = await axios.post(
  //           `${api}/students/import`, 
  //           { students }, 
  //           getAuthHeader()
  //         );
          
  //         // Show detailed results
  //         if (response.data.imported_count > 0) {
  //           toast.success(`Imported ${response.data.imported_count} students successfully!`);
  //         }
          
  //         if (response.data.skipped_count > 0) {
  //           toast.warning(`Skipped ${response.data.skipped_count} students due to errors`);
  //           // Log errors to console for debugging
  //           console.error('Import errors:', response.data.errors);
  //         }

  //         isImportModalOpen.value = false;
  //         selectedFile.value = null;
          
  //         // Refresh student list
  //         std.fetchStudents();
  //       } catch (error) {
  //         if (error.response) {
  //           // Backend validation errors
  //           if (error.response.status === 422) {
  //             toast.error('Validation errors occurred during import');
  //             console.error('Validation errors:', error.response.data.errors);
  //           } else {
  //             toast.error(`Failed to import students: ${error.response.data.message}`);
  //           }
  //         } else {
  //           toast.error('Failed to import students. Please check console for details.');
  //           console.error('Import error:', error);
  //         }
  //       } finally {
  //         isLoading.value = false;
  //       }
  //     }

  //     const readExcelFile = async (file) => {
  //       return new Promise((resolve, reject) =>{
  //         const reader = new FileReader();

  //         reader.onload = (event) => {
  //           try{
  //             const data = new Uint8Array(event.target.result);
  //             const workbook = XLSX.read(data, {type: 'array'});
  //             const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  //             const jsonData = XLSX.utils.sheet_to_json(firstSheet);
  //             resolve(jsonData);
  //           }catch(error){
  //             reject(error);
            
  //           }
  //         };

  //         reader.onerror = (error) => {
  //           reject(error);
  //         };

  //         reader.readAsArrayBuffer(file);
  //       });
  //     };

  //    const parseExcelData = (excelData) => {
  //     return excelData.map(row => ({
  //       student_id: String(row['Student_ID'] || row['student_id'] || '').trim(),
  //       rfid_uid: String(row['RFID_UID'] || row['rfid_uid'] || '').trim(),
  //       first_name: String(row['First_Name'] || row['first_name'] || '').trim(),
  //       middle_name: String(row['Middle_Name'] || row['middle_name'] || '').trim(),
  //       last_name: String(row['Last_Name'] || row['last_name'] || '').trim(),
  //       email: String(row['Email'] || row['email'] || '').trim().toLowerCase(),
  //     })).filter(student => 
  //       student.student_id && 
  //       student.first_name && 
  //       student.last_name && 
  //       student.email
  //     );
  //   };


  //     return{
  //       isImportModalOpen,
  //       selectedFile,
  //       isDragOver,
  //       fileInput,
  //       isLoading,
  //       handleFileUpload,
  //       handleDrop,
  //       removeFile,
  //       importStudents,
  //       readExcelFile,
  //       parseExcelData,
  //     }

  // });

  export const useStatusDistributionStore = defineStore('statusDistribution', () => {

    const onlineCount = ref(0);
    const offlineCount = ref(0);
    const lockedCount = ref(0);
    const unlockedCount = ref(0);
    const totalCount = ref(0);
    const activeCount = ref(0);
    const inactiveCount = ref(0);
    const maintenanceCount = ref(0);

    const fetchStatusDistribution = async () => {
      try {
        const response = await axios.get(`${api}/computer/status-distribution`, getAuthHeader());
        const data = response.data;

        onlineCount.value = data.online_count || 0;
        offlineCount.value = data.offline_count || 0;
        lockedCount.value = data.locked_count || 0;
        unlockedCount.value = data.unlocked_count || 0;
        totalCount.value = data.computers || 0;
        activeCount.value = data.active_count || 0;
        inactiveCount.value = data.inactive_count || 0;
        maintenanceCount.value = data.maintenance_count || 0;


      } catch (error) {
        console.error('Error fetching status distribution:', error);
        toast.error('Failed to fetch status distribution');
      }
    };
    return {
      onlineCount,
      offlineCount,
      lockedCount,
      unlockedCount,
      totalCount,
      activeCount,
      inactiveCount,
      maintenanceCount,
      fetchStatusDistribution,
    };
  });
