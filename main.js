
const app = Vue.createApp({
  data() {
    return {
      currentPage: 'index',
      previousPage: '',
      inns: [],
      innId: '',
      selectedInn: {},
      selectedInnRating: {},
      allRooms: [],
      rooms: [],
      roomId: '',
      searchInns: '',
    }
  },
  created() {
    this.getData(),
      { immediate: true }
  },

  computed: {
    innsResult() {
      if (this.searchInns) {
        return this.inns.filter(inns => {
          return inns.brand_name.toLowerCase().includes(this.searchInns.toLowerCase())
        })
      } else {
        return this.inns
      }
    },

  },

  methods: {
    async getData() {
      let innsIndex = await fetch('http://localhost:3000/api/v1/inns/')
      this.inns = await innsIndex.json();

      this.allRooms = []
      this.inns.forEach(async (inn) => {
        let roomsIndex = await fetch(`http://localhost:3000/api/v1/inns/${inn.id}/rooms`)
        let test = await roomsIndex.json()
        test.forEach(room => {
          this.allRooms.push(room);
        })
      })
      console.log(this.innsIndex);
      console.log(this.currentPage);
      console.log(this.allRooms);
    },
    async getRooms(innId) {
      this.rooms = []
      this.selectedInn = {}
      this.selectedInnRating = {}
      let innDetails = await fetch(`http://localhost:3000/api/v1/inns/${innId}/`)
      let teste = await innDetails.json()
      teste[0].check_in = teste[0].check_in.slice(teste[0].check_in.indexOf('T') + 1, teste[0].check_in.indexOf('T') + 6)
      teste[0].check_out = teste[0].check_out.slice(teste[0].check_out.indexOf('T') + 1, teste[0].check_out.indexOf('T') + 6)
      this.selectedInn = teste[0]
      this.selectedInnRating = teste[1].average_rating
      // this.selectedInn = ''
      // this.inns.forEach (inn => {
      //   if (inn.id == innId) {
      //     this.selectedInn = inn
      //   }
      // })
      let roomsIndex = await fetch(`http://localhost:3000/api/v1/inns/${innId}/rooms`)
      let test = await roomsIndex.json()
      test.forEach(room => {
        if (room.status == "vacant") {
          this.rooms.push(room);
        }

      })
      console.log(this.selectedInn);
      console.log(this.innId);
      console.log(this.rooms);
    },
  }
})

app.mount('#app');