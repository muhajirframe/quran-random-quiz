<template>
  <div id="app">
    <h1>Om Tebak Om</h1>
    <mu-raised-button @click="getRandomSurah" icon="replay" label="Refresh" primary/>
    <div class="container">
      <div class="surah" >Surah {{ namaSurah }} ({{ surah }}) : {{ ayat }} - {{ ayat + 2 }}
      </div>
      <div v-for="item in tulisan">
        <h2 class="ayat">{{ item }}</h2>
      </div>
    </div>
    <mu-float-button @click="showJawaban" icon="arrow_downward" secondary class="demo-float-button"/>
    <h2 id="jawaban" class="ayat" v-if="showJawaban">{{ jawaban }}</h2>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      minSurah: 1,
      maxSurah: 114,
      surah: '',
      namaSurah: '',
      ayat: '',
      tulisan: '',
      jawaban: '',
      jawabanShowed: false
    }
  },
  methods: {
    getRandom(min, max, fn) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
      fn(randomNum)
    },
    showJawaban() {
      this.jawabanShowed = true
      document.getElementById('jawaban').scrollIntoView()
    },
    printAyat() {
      axios.get(`http://staging.quran.com:3000/api/v3/chapters/${this.surah}/verses`, {
        params: {
          offset: 2,
          limit: 3,
          text_type: 'image'
        }
      })
        .then(response => {
          const verses = response.data.verses
          console.log(verses)
          this.tulisan = verses.slice(0, 2).map(item => item.text_madani)
          this.jawaban = verses[2].text_madani
        }).catch(error => console.log(error))
    },
    getRandomSurah() {
      this.jawabanShowed = false
      this.getRandom(this.minSurah, this.maxSurah, result => this.surah = result)
      axios.get(`http://staging.quran.com:3000/api/v3/chapters/${this.surah}`)
        .then(response => {
          const maxAyat = response.data.chapter.verses_count
          this.namaSurah = response.data.chapter.name_complex
          this.getRandom(1, maxAyat - 2, result => this.ayat = result)
          this.printAyat()
        }).catch(error => console.log(error)) 
    }
  },
  created() {
    this.getRandomSurah()
    console.log(this.ayat)
  }
}
</script>

<style src="muse-ui/dist/muse-ui.css"></style>
<style src="muse-ui/dist/theme-light.css"></style>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.ayat {
  font-family: 'Amiri', serif;
}
.surah {
  text-align: center;
  width: 100%
}
.container {
  margin: auto;
  widows: 100%;
  padding: 2rem 10rem;
  color: #555;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
