<script setup>
import { onMounted } from "vue";
import { ref, toRaw, defineProps, toRef,watch } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import Loader from "../components/Loader.vue";
import TextField from "../components/TextField.vue";
import ViewSnackBar from "../components/ViewSnackBar.vue";
import { updateSnackBar } from "../common";


const props = defineProps({
  user: Object,
});
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = toRef(props, 'user');
console.log(user.value);
const isLoader = ref(false);
onMounted(async () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
});


async function addCourier() {
  if(user.value.name === "") {
      snackbar.value = updateSnackBar("First Name is Empty")
  }
  else if(user.value.contact === "") {
    snackbar.value = updateSnackBar("Last name is empty")
  }
  else if(user.value.email === "") {
    snackbar.value = updateSnackBar("Email is empty")
  }
  else {
    isLoader.value = true
    await UserServices.updateUser({...user.value})
        .then((response) => {
            snackbar.value = updateSnackBar("Courier is created successfully!","green")
            isLoader.value = false
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = updateSnackBar(error.response.data.message)
            isLoader.value = false
        });
  }
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Update Courier </v-card-title>
        </div>
        <Loader v-if="isLoader" />
        <v-card-text v-else>
          <TextField class="md-3" id="name" title="First Name" :value="user.firstName" @update:value="user.firstName = $event"/>
          <TextField class="md-3" id="last" title="Last Name" :value="user.lastName" @update:value="user.lastName = $event"/>
          <TextField class="md-3" id="email" title="Email" :value="user.email" @update:value="user.email = $event"/>
          <!-- <TextField class="md-3" id="email" title="Email" :value="user.role_id" @update:value="user.role_id = $event" :disabled="true"/> -->
          <div style="margin-top:10px"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="addCourier()">Update</v-btn>
        </v-card-actions>
      </v-card>
      <ViewSnackBar :snackbar="snackbar"/>
    </div>
  </v-container>
</template>

<style scoped>
.add {
  margin-right: 20px;
  height: 40px;
  margin-top: 5px;
}
.heading {
    margin-top: 10px;
    justify-content: space-between;
}
</style>