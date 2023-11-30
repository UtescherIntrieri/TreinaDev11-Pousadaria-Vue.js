
const app = Vue.createApp({
  data(){
    return {
      inns: [],
      rooms: [],
      searchInns: ''
     }
  },
  created() {
    this.getData(),
    { immediate: true }
  },

  computed:{
    innsResult(){
      if(this.searchInns){
        return this.inns.filter(inns => {
          return inns.brand_name.toLowerCase().includes(this.searchInns.toLowerCase())
        })
      } else {
        return this.inns
      }
    }
  },

  methods: {
    async getData(){
      let innsIndex = await fetch('http://localhost:3000/api/v1/inns/')
      this.inns = await innsIndex.json();
      this.rooms = []
      this.inns.forEach(async (inn) => {
        let roomsIndex = await fetch(`http://localhost:3000/api/v1/inns/${inn.id}/rooms`)
        let test = await roomsIndex.json()
        test.forEach(room => {
          this.rooms.push(room);
        })
        
        console.log(this.rooms);
        console.log(this.innsResult);
      });
    }
  }
})

app.mount('#app');