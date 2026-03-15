<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const services = ref([]);
const loading = ref(true);

const fetchStatus = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:5000/api/health");
    services.value = response.data;
  } catch (err) {
    console.error("เชื่อมหลังบ้านไม่ได้นะเพื่อน:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStatus();
  setInterval(fetchStatus, 50000);
});
</script>

<template>
  <div class="dashboard">
    <header>
      <h1>🛰️ Tech Monitor Status</h1>
      <p>คอยเฝ้าดู Service ให้คุณแบบ Real-time</p>
    </header>

    <div v-if="loading && services.length === 0" class="loader">
      กำลังเช็กสถานะ...
    </div>

    <div class="grid">
      <div
        v-for="item in services"
        :key="item.id"
        :class="['card', item.status.toLowerCase()]"
      >
        <div class="status-dot"></div>
        <h2>{{ item.name }}</h2>
        <p class="url">{{ item.url }}</p>
        <div class="info">
          <span
            >Latency: <strong>{{ item.latency }}</strong></span
          >
          <span
            >Status: <strong>{{ item.status }}</strong></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard {
  padding: 40px;
  font-family: "Inter", sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 8px solid #ccc;
  transition: transform 0.2s;
}


.card:hover {
  transform: translateY(-5px);
}

.online {
  border-left-color: #2ecc71;
}

.offline {
  border-left-color: #e74c3c;
  opacity: 0.8;
}

.warning {
  border-left-color: #f1c40f;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.online .status-dot {
  background: #2ecc71;
  box-shadow: 0 0 8px #2ecc71;
}

.offline .status-dot {
  background: #e74c3c;
}

.url {
  color: #666;
  font-size: 0.9rem;
}

.info {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}
</style>