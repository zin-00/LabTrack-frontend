<script setup>
import TextInput from '../components/input/TextInput.vue';
import { onMounted, ref, toRefs, watch} from "vue";
import { useComputerStore } from '../composable/computers';
import { storeToRefs } from 'pinia';
import { useComputerLogStore } from '../composable/computerLog';

const comp = useComputerStore();
const compLog = useComputerLogStore();




const {
      unlockAssignedComputer,
      } = comp;

const {
  fetchRecentScans
      } = compLog;

const {
      latestScan
      } = toRefs(compLog);

const {
        isSubmitting,
        errorMessage,
        data
    } = storeToRefs(comp);

// const latestScan = ref([]);

const sendRequest = async (rfid_uid) => {
  await unlockAssignedComputer(rfid_uid);
data.rfid_uid = '';
}


watch(() => data.value.rfid_uid, (newValue) => {
  if (newValue && newValue.length === 10) {
    sendRequest(newValue);
  }
});
const recentScans = ref([
  {
    id: 1,
    name: "John Doe",
    computerNumber: "PC-12",
    ipAddress: "192.168.1.45",
    timestamp: "2024-08-25 14:30:22"
  },
  {
    id: 2,
    name: "Jane Smith", 
    computerNumber: "PC-08",
    ipAddress: "192.168.1.38",
    timestamp: "2024-08-25 14:25:15"
  },
  {
    id: 3,
    name: "Mike Johnson",
    computerNumber: "PC-15",
    ipAddress: "192.168.1.52",
    timestamp: "2024-08-25 14:20:08"
  }
]);

onMounted(() => {
  if(!window.Echo){
    console.log('Echo is not defined')
  }
    if(window.Echo){
      let echoChannel = window.Echo.channel('computer');
      echoChannel.listen('ComputerUnlockRequested', (e)=> {
        success('Event received:', e.message);
        console.log(e);
        if(e.studentId){
          latestScan.value = e.studentId;
        }
      })
  }

  fetchRecentScans();
});

</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
        <div class="flex items-center space-x-3 p-5">
            <div class="w-12 h-12 rounded flex items-center justify-center">
            <img src="../assets/LABTrack.png" alt="" srcset="">
            </div>
                <p class="font-[Orbitron] text-sm font-bold">LAB<span class="text-[#12e19f] ">TRACK</span></p>
        </div>
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Column 1: Scanner -->
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div class="flex items-center">
              <div class="p-2 bg-black rounded-lg flex items-center justify-center">
                <!-- <FlScanQrCode class="h-5 w-5 text-white"/> -->
              </div>
              <p class="text-2xl font-mono ml-3 text-black">Scanner</p>
            </div>
          </div>

          <div class="mb-6">
            <label for="rfid_input" class="block text-sm font-medium text-gray-700 mb-1">Scan RFID Tag</label>
            <TextInput
              id="rfid_input"
              type="password"
              placeholder="Scan your RFID"
              class="border-1.5 border-gray-300 p-3 rounded-lg w-full text-center text-lg focus:border-gray-600 focus:ring-gray-600 transition-colors"
              maxlength="10"
              @keyup.enter="sendRequest(data.rfid_uid)"
              v-model="data.rfid_uid"
              autofocus
              :disabled="isSubmitting"
              autocomplete="off"
            />
          </div>

          <!-- Processing indicator -->
          <div v-if="isSubmitting" class="flex justify-center items-center mb-4">
            <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-2 text-gray-700">Processing...</span>
          </div>

          <!-- Status Messages -->
          <div v-if="errorMessage" class="bg-gray-100 border border-gray-400 text-gray-800 px-4 py-3 rounded mb-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 text-center text-sm text-gray-500">
            <p>Place your RFID tag near the scanner</p>
          </div>
        </div>

        <!-- Column 2: Recent Scans -->
        <div class="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Recent Scans</h2>

          <div v-if="latestScan.length > 0" class="space-y-4">
            <div 
              v-for="scan in latestScan" 
              :key="scan.id"
              class="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <!-- Profile Avatar -->
              <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {{ scan.student?.first_name ? scan.student.first_name.charAt(0) : '' }}
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ scan.student?.first_name }} {{ scan.student?.last_name }}</p>
                <div class="flex items-center space-x-3 text-xs text-gray-600">
                  <span>{{ scan.computer?.computer_number }}</span>
                  <span>{{ scan.computer?.laboratory?.name }}</span>
                  <span>{{ scan.computer?.ip_address }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ scan.timestamp }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-gray-500 text-sm text-center py-8">
            No recent scans available.
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>