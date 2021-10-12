<template>
  <div id="app">
    <div class="container">
      乗馬ログ
      <div>とりあえずツイートのスクショで勘弁してください。</div>
      <div class="photo" v-for="(photo, i) in photos" :key="i">
        <img :src="photo" alt="photo" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  computed: {
    photos() {
      return [...new Array(19)]
        .map((elm, idx) => {
          return require(`@/assets/img/tweet-ss${idx + 1}.png`);
        })
        .reverse();
    },
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.photos);
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  background: #161d26;
  color: white;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
