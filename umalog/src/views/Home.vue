<template>
  <div>
    <div v-for="(tweet, i) in tweets" :key="i">
      <tweet
        :text="tweet.text"
        :date="Number(tweet.date)"
        :photos="tweet.photos"
      />
    </div>
    <hello-world />
  </div>
</template>

<script>
import Vue from "vue";
import HelloWorld from "../components/HelloWorld.vue";
import tweetsRawCsv from "@/assets/tweets.csv";
import photosRawCsv from "@/assets/photos.csv";
import Tweet from "@/components/Tweet.vue";

export default Vue.extend({
  name: "Home",

  components: {
    HelloWorld,
    Tweet,
  },

  data() {
    return {
      tweets: [],
      photos: [],
    };
  },

  created() {
    this.photos = photosRawCsv.slice(1).map((elm) => {
      return {
        id: elm[0],
        tweet_id: elm[1],
        path: elm[2],
      };
    });
    console.log(this.photos);
    this.tweets = tweetsRawCsv
      .slice(1)
      .map((tweet) => {
        return {
          id: tweet[0],
          date: tweet[1],
          text: tweet[2],
          photos: this.photos
            .filter((photo) => {
              return photo.tweet_id === tweet[0];
            })
            .map((elm) => elm.path),
        };
      })
      .sort((a, b) => a.date - b.date);
    console.log(this.tweets);
  },
});
</script>
