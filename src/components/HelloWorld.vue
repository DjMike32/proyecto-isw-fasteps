<style>
  .verde {
    color: green;
  }

  .rojo {
    color: red;
  }

  .bg-color {
    background-color: blue;
  }

  .amarillo {
    color: yellow;
  }

  .disabled {
    display: none;
  }
</style>

<script setup>
  import { ref, computed } from "vue";
  import "tailwindcss/tailwind.css";



  const arrayFrutas = [
    {
      name: "Manzana",
      price: "$1.50",
      description: "una manzana",
      stock: 0,
    },
    {
      name: "pera",
      price: "$2.00",
      description: "Una pera grande y fresca",
      stock: 10,
    },
    {
      name: "naranja",
      price: "$3.00",
      description: "una naranja",
      stock: 20,
    },
  ];

  const objectFruta = {
    name: "Manzana",
    price: "$1.50",
    description: "una manzana",
  };

  const handleClick = () => {
    alert("Hola");
  };

  const counter = ref(0);
  const numUser = ref([]);

  const nombreNuevaFruta = ref("");
  const cantidadNuevaFruta = ref("");

  const increment = () => {
    counter.value++;
  };

  const reset = () => {
    counter.value = 0;
    numUser.value = [];
  };

  const decrease = () => {
    counter.value--;
  };

  const classCounter = computed(() => {
    if (counter.value === 0) {
      return "amarillo";
    }
    if (counter.value > 0) {
      return "verde";
    }
    if (counter.value < 0) {
      return "rojo ";
    }
  });

  const disabledButton = computed(() => {
    if (numUser.value.includes(counter.value)) {
      return "pointer-events-none";
    }
  });

  const añadir = () => {
    numUser.value.push(counter.value);
  };

  // fetch('https://pokeapi.co/api/v2/pokemon/')
  //   .then((res) => res.json()) // Parse the JSON data from the response
  //   .then(data => {
  //     data.results.forEach(element => {
  //       console.log(element.name + 'pokemon');
  //     });
  //   })
  //   .catch(error => console.log(error));

  const obtenerPokemones = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/");
      const data = await res.json();
      const arrayData = data.results.map((poke) => poke.name);
      console.log(arrayData);
    } catch (error) {
      console.log(error);
    }
  };
  obtenerPokemones();

  const data = {
    frutas: [
      { nombre: "pera", cantidad: 10 },
      { nombre: "manzana", cantidad: 0 },
      { nombre: "platano", cantidad: 5 },
    ],
  };

  function agregarFruta() {
    data.frutas.push({
      nombre: nombreNuevaFruta.value,
      cantidad: parseInt(cantidadNuevaFruta.value),
    });
    nombreNuevaFruta.value = "";
    cantidadNuevaFruta.value = "";
  }
</script>

<template>
  <!-- <ul>
    <li v-for="(fruta, index) in arrayFrutas " :key="fruta.name">
      {{ fruta.name }} - {{ index }} .
    </li>
  </ul> -->

  <ol>
    <li v-for="(value, property, index) in objectFruta" :key="index">
      {{ value }} - {{ property }} - {{ index }}
      <span v-if="property === 'name'"> es una pera! </span>
    </li>
  </ol>
  <input type="text" placeholder="Escribe la fruta" />

  <ul class="list-disc list-inside bg-blue-100">
    <template v-for="fruta in arrayFrutas" :key="fruta.name">
      <li v-if="fruta.stock > 10">
        {{ fruta.price }}
      </li>
    </template>
  </ul>



  <button @click.middle="handleClick">Activame</button>
  <span :class="classCounter">{{ counter }}</span>
  <button @click="increment">Aumentar</button>
  <button @click="decrease">Disminuir</button>
  <button @click="añadir()" :class="disabledButton">añadir</button>
  <button @click="reset" class="bg-purple-500">Reiniciar</button> <br />
  <input type="file"
    class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />

  <ul class="list-disc list-inside">
    <li v-for="numero in numUser" :key="numero">
      {{ numero }}
    </li>
  </ul>

  <h1 class="underline decoration-yellow-300 decoration-wavy">
    Lista de frutas para comprar
  </h1>
  <form @submit.prevent="agregarFruta" class="mt-6 grid flex-col justify-items-center gap-4">
    <input type="text" placeholder="Fruta" v-model="data.nombreNuevaFruta" />
    <input type="number" name="cantidad" id="cantidad" placeholder="cantidad" v-model="data.cantidadNuevaFruta" />
    <button type="submit" class="bg-yellow-300 px-10 shadow-lg opacity-75 hover:opacity-100">
      Agregar a la lista
    </button>
  </form>

  <ul>
    <li v-for="fruta in data.frutas" :key="fruta.nombre">
      {{ fruta.nombre }} - {{ fruta.cantidad }}
    </li>
  </ul>
</template>
