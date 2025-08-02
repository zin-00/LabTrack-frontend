<script setup>
import GuessLayout from '../layouts/GuessLayout.vue';
</script>

<template>
  <GuessLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
        <div class="container mx-auto px-6 py-24">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Institution Header -->
            <div class="mb-8">
              <div class="inline-flex items-center justify-center">
                <!-- <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg> -->

                <img src="../assets/logo-bg-trans.png" alt="" class="w-20 h-20">
              </div>
              <p class="text-green-200 text-sm font-medium uppercase tracking-wide mb-2">
                Saint Francis Xavier College
              </p>
            </div>

            <!-- Main Title -->
            <h1 class="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Lab<span class="text-green-300">Track</span>
            </h1>
            
            <!-- Subtitle -->
            <p class="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive Laboratory Management System<br>
              <span class="text-green-200 text-lg">Empowering Academic Excellence Through Innovation</span>
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <router-link
                to="/login"
                class="bg-white text-green-800 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 min-w-[160px] shadow-lg"
              >
                Faculty Login
              </router-link>
              
              <router-link
                to="/register"
                class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-all duration-200 min-w-[160px]"
              >
                Request Access
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-6 py-20">
        <div class="max-w-6xl mx-auto">
          
          <!-- Mission Statement -->
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-green-800 mb-4">
              Advanced Laboratory Management
            </h2>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Supporting Saint Francis Xavier College's commitment to academic excellence through 
              state-of-the-art laboratory management and research facilitation.
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-3 gap-8 mb-16">
            <div class="bg-white rounded-xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-green-800 mb-4 text-center">Equipment Management</h3>
              <p class="text-gray-600 text-center leading-relaxed">
                Comprehensive tracking and maintenance of laboratory equipment, ensuring optimal performance and safety compliance.
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-green-800 mb-4 text-center">Research Analytics</h3>
              <p class="text-gray-600 text-center leading-relaxed">
                Advanced reporting and analytics to support research initiatives and academic program assessment.
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-green-800 mb-4 text-center">Academic Collaboration</h3>
              <p class="text-gray-600 text-center leading-relaxed">
                Seamless coordination between faculty, students, and research teams across departments.
              </p>
            </div>
          </div>

          <!-- Key Benefits -->
          <div class="bg-green-50 rounded-2xl border border-green-200 p-8 mb-16">
            <h3 class="text-2xl font-bold text-green-800 text-center mb-8">
              Why Choose LabTrack?
            </h3>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-800 mb-2">Academic Integration</h4>
                  <p class="text-gray-700">Designed specifically for educational institutions with academic calendar and curriculum support.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-800 mb-2">Safety Compliance</h4>
                  <p class="text-gray-700">Built-in safety protocols and compliance tracking for laboratory operations.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-800 mb-2">Research Support</h4>
                  <p class="text-gray-700">Tools and features specifically designed to support academic research and student projects.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-800 mb-2">Cost Efficiency</h4>
                  <p class="text-gray-700">Optimize resource allocation and reduce operational costs through intelligent management.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Section -->
          <div class="text-center bg-white rounded-2xl shadow-lg border border-green-100 p-8">
            <h3 class="text-2xl font-bold text-green-800 mb-4">
              Ready to Transform Your Lab Management?
            </h3>
            <p class="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join Saint Francis Xavier College's commitment to academic excellence with our comprehensive laboratory management solution.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link
                to="/contact"
                class="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200"
              >
                Contact IT Support
              </router-link>
              <router-link
                to="/about"
                class="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
              >
                Learn More
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </GuessLayout>
</template>

<style scoped>
/* Institutional design refinements */
.container {
  max-width: 1200px;
}

/* Enhanced typography for institutional feel */
h1 {
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2, h3 {
  letter-spacing: -0.01em;
}

/* Subtle animations */
.hover\:shadow-xl:hover {
  transform: translateY(-2px);
}

/* Focus states for accessibility */
a:focus, button:focus {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}

/* Gradient text effect */
.bg-gradient-to-br {
  background-attachment: fixed;
}

/* Card hover effects */
.group:hover {
  transform: translateY(-4px);
}

/* Professional shadow effects */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>