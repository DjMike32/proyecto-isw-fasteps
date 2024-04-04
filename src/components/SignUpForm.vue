<script setup>
    import { ref } from "vue";

    const data = ref({
        email: "",
        password: "",
        role: "",
        terms: false,
        names: [],
        tempSkill: "",
        skills: [],
        passwordError: "",
    });

    const addSkill = (e) => {
        if (e.key === "," && data.value.tempSkill !== "") {
            data.value.skills.push(data.value.tempSkill);
            data.value.tempSkill = "";
        }
    };

    const deleteItem = (skill) => {
        // data.value.skills.splice(data.value.skills.indexOf(skill), 1);
        data.value.skills = data.value.skills.filter((item) => {
            return skill !== item;
        });
    };

    const handleSubmit = () => { };
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <label for=""> Email: </label>
        <input type="email" required v-model="data.email" />

        <label for=""> Password: </label>
        <input type="password" required v-model="data.password" />
        <select name="" id="" v-model="data.role">
            <option value="Developer">Web developer</option>
            <option value="Designer">Web designer</option>
        </select>
        <label for="">Skills:</label>
        <input type="text" v-model="data.tempSkill" @keyup.alt="addSkill" />

        <div v-for="skill in data.skills" :key="skill" class="pills" @click="deleteItem(skill)">
            {{ skill }}
        </div>

        <div class="terms">
            <input type="checkbox" required v-model="data.terms" />
            <label for="">Accept terms and conditions</label>
        </div>
        <!-- <div>
            <input type="checkbox" value="shaun" v-model="data.names" />
            <label for="">Shaun</label>
        </div>
        <div>
            <input type="checkbox" value="mario" v-model="data.names" />
            <label for="">Mario</label>
        </div>
        <div>
            <input type="checkbox" value="yoshi" v-model="data.names" />
            <label for="">Yoshi</label>
        </div> -->

        <button class="ml-16 bg-blue-500 rounded-xl p-2 text-white">Create an account</button>
    </form>

    <p>Email: {{ data.email }}</p>
    <p>Password: {{ data.password }}</p>
    <p>Role: {{ data.role }}</p>
    <p>Terms: {{ data.terms }}</p>
    <p>Names: {{ data.names }}</p>
    <p>tempSkill: {{ data.tempSkill }}</p>
</template>

<style scoped>
    body {
        background-color: antiquewhite;
    }

    /* form {
        max-width: 360px;
        margin: auto;
        background: white;
        padding: 28px;
        border-radius: 10px;
        margin-top: 30px;
    } */

    label {
        color: #aaa;
        display: inline-block;
        margin: 15px 0 15px;
        font-size: 0.6em;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
    }

    input,
    select {
        display: block;
        padding: 5px 6px;
        width: 50%;
        box-sizing: border-box;
        border-bottom: 1px solid #dfcbcba8;
        color: #464549b1;
    }

    input[type="checkbox"] {
        display: inline-block;
        width: 16px;
        margin: 0 10px 0 0;
        position: relative;
        top: 2px;
    }

    .pills {
        display: inline-block;
        margin: 20px 10px 0 0;
        padding: 6px 12px;
        background: #eee;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        color: #777;
        cursor: pointer;
    }

    .button {
        display: block;
        margin: 0;
    }
</style>
