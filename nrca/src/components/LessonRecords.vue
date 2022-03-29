<template>
  <div class="record">
    乗馬記録
    <div class="lesson-record-list">
      <div class="header d-flex align-center justify-content-start">
        <div class="year btn" @click="onClickYear()">年</div>
        <div class="date ml-4 btn" @click="onClickDate()">日付</div>
        <div class="time ml-4">時間</div>
        <div class="lesson ml-4 btn" @click="onClickLesson()">レッスン名</div>
        <div class="teacher ml-4 btn" @click="onClickTeacher()">担当</div>
        <div class="horse ml-4 btn" @click="onClickHorse()">🐴</div>
      </div>
      <div class="item d-flex align-center justify-content-start"
        :class="{odd: idx % 2 === 0}"
        v-for="(item, idx) in sortedRecords" :key="idx"
      >
        <div class="year">{{ getYear(item.date) }}</div>
        <div class="date ml-4">{{ getDate(item.date, item.daytype) }}</div>
        <div class="time ml-4">{{ getTime(item.start) }}</div>
        <div class="lesson ml-4 btn"
          @click="onClickLesson(item.lesson)">{{ item.lesson }} ({{ item.length }}分)</div>
        <div class="teacher ml-4 btn"
          @click="onClickTeacher(item.teacher)">{{ item.teacher }}</div>
        <div class="horse ml-4 btn"
          @click="onClickHorse(item.horse)" >{{ item.horse }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LessonRecords',
  props: {
    records: { type: Array, require: true }
  },
  data () {
    return {
      sortedRecords: []
    }
  },
  watch: {
    records: {
      handler (records) {
        const props = [
          { ja: 'レッスン時間', en: 'length' },
          { ja: '担当', en: 'teacher' },
          { ja: 'コメント', en: 'comment' },
          { ja: 'レッスン名', en: 'lesson' },
          { ja: '場所', en: 'place' },
          { ja: '天候', en: 'weather' },
          { ja: '専用馬', en: 'reserved' },
          { ja: '日付', en: 'date' },
          { ja: '曜日', en: 'daytype' },
          { ja: '終了時刻', en: 'end' },
          { ja: '開始時刻', en: 'start' },
          { ja: '馬匹名', en: 'horse' }
        ]
        if (!records) {
          return
        }
        this.sortedRecords = records
        for (const record of this.sortedRecords) {
          for (const prop of props) {
            record[prop.en] = record[prop.ja]
          }
        }
      },
      deep: true
    }
  },
  methods: {
    onClickCount () {
      this.sortedRecords = this.records
      return this.sortedRecords.sort((a, b) => {
        if (a.count < b.count) return -1
        if (a.count > b.count) return +1
        return 0
      })
    },
    onClickYear () {
      this.sortedRecords = this.records
      return this.sortedRecords.sort((a, b) => {
        if (a.date < b.date) return -1
        if (a.date > b.date) return +1
        return 0
      })
    },
    onClickDate () {
      this.sortedRecords = this.records
      return this.sortedRecords.sort((a, b) => {
        if (a.date < b.date) return -1
        if (a.date > b.date) return +1
        return 0
      })
    },
    onClickHorse (horse) {
      this.sortedRecords = this.records
      if (horse === undefined) {
        return this.sortedRecords.sort((a, b) => {
          if (a.horse < b.horse) return -1
          if (a.horse > b.horse) return +1
          return 0
        })
      }
      this.sortedRecords = this.records.filter(record => {
        return record.horse === horse
      })
      this.$forceUpdate()
    },
    onClickLesson (lesson) {
      this.sortedRecords = this.records
      if (lesson === undefined) {
        return this.sortedRecords.sort((a, b) => {
          if (a.lesson < b.lesson) return -1
          if (a.lesson > b.lesson) return +1
          return 0
        })
      }
      this.sortedRecords = this.sortedRecords.filter(record => {
        return record.lesson === lesson
      })
    },
    onClickTeacher (teacher) {
      this.sortedRecords = this.records
      if (teacher === undefined) {
        return this.sortedRecords.sort((a, b) => {
          if (a.teacher < b.teacher) return -1
          if (a.teacher > b.teacher) return +1
          return 0
        })
      }
      this.sortedRecords = this.sortedRecords.filter(record => {
        return record.teacher === teacher
      })
    },
    getYear (timestamp) {
      const date = new Date(timestamp);
      if (!timestamp || isNaN(date.getFullYear())) {
        return ''
      }
      return date.getFullYear()
    },
    getDate (timestamp, dayType) {
      const date = new Date(timestamp);
      if (!timestamp || isNaN(date.getMonth())) {
        return ''
      }
      return date.getMonth()+1 + '/' + date.getDate() + '(' + dayType + ')'
    },
    getTime (timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getHours())) {
        return ''
      }
      return date.getHours() + ':' + date.getMinutes()
    }
  }
}
</script>
<style lang="scss" scoped>
.lesson-record-list {
  border: 2px solid #e0e0e0;
  line-height: 2em;

  .btn {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: #a0a0a0;
    }
  }
  .item {
    border: 1px solid #e0e0e0;
    line-height: 2em;
    height: 2em;
    &.odd {
      background-color: #c0e0a0;
    }
    text-overflow: ellipsis;
  }
  .year {
    text-align: right;
    min-width: 60px;
    max-width: 60px;
  }
  .date {
    text-align: right;
    min-width: 80px;
    max-width: 80px;
  }
  .time {
    text-align: right;
    min-width: 40px;
    max-width: 40px;
  }
  .lesson {
    text-align: left;
    min-width: 200px;
    max-width: 200px;
  }
  .teacher {
    min-width: 40px;
    max-width: 40px;
  }
}
</style>