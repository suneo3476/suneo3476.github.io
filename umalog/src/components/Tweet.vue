<template>
  <div>
    <div class="tweet-section pa-2 d-flex">
      <div class="left-row">
        <div class="circle-crop">
          <img :src="icon" alt="" />
        </div>
      </div>
      <div>
        <div class="heading d-flex justify-start align-end">
          <div class="display-name">すねお</div>
          <div v-if="isPrivate" class="private-icon">
            <v-icon class="blue-gray">mdi-lock</v-icon>
          </div>
          <div>@suneo3476Pro</div>
          <div>・</div>
          <div class="date">{{ dateText }}</div>
        </div>
        <div class="tweet-text">{{ text }}</div>
      </div>
    </div>
    <div v-if="photos.length" class="photo-section d-flex">
      <div class="photo pa-2" v-for="(photo, i) in photos" :key="i">
        <img :src="require(`@/assets/photos/${photo}`)" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    text: { type: String, require: true },
    date: { type: Number, require: true },
    photos: { type: Array, require: true },
  },

  data() {
    return {
      icon: require("@/assets/twitter-icon.png"),
      isPrivate: true,
    };
  },

  computed: {
    dateText() {
      return moment(this.date * 1000).format("YYYY年MM月DD日");
    },
  },
};
</script>

<style lang="scss" scoped>
.tweet-section {
  .left-row {
    min-width: 72px;
  }
  .display-name {
    font-weight: bold;
  }
  i.v-icon.v-icon {
    color: black;
    font-size: 1em;
  }
  .tweet-text {
    letter-spacing: 0em;
  }
  .date {
    text-decoration: underline;
  }
}
.photo-section {
  .photo img{
    max-width: 320px;
  }
}
.circle-crop {
  width: 64px;
  height: 64px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  img {
    display: inline;
    margin: 0 auto;
    height: 100%;
    width: auto;
  }
}
</style>