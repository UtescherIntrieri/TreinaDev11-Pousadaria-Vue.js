
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
      sendCheck: false,
      arriveDate: '',
      leaveDate: '',
      groupSize: '',
      reservation: {}
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
        let innRooms = await roomsIndex.json()
        innRooms.forEach(room => {
          this.allRooms.push(room);
        })
      })
    },
    async getRooms(innId) {
      this.rooms = []
      this.selectedInn = {}
      this.selectedInnRating = {}
      let innDetails = await fetch(`http://localhost:3000/api/v1/inns/${innId}/`)
      let inn = await innDetails.json()
      inn[0].check_in = inn[0].check_in.slice(inn[0].check_in.indexOf('T') + 1, inn[0].check_in.indexOf('T') + 6)
      inn[0].check_out = inn[0].check_out.slice(inn[0].check_out.indexOf('T') + 1, inn[0].check_out.indexOf('T') + 6)
      this.selectedInn = inn[0]
      this.selectedInnRating = inn[1].average_rating
      let roomsIndex = await fetch(`http://localhost:3000/api/v1/inns/${innId}/rooms`)
      let innRooms = await roomsIndex.json()
      innRooms.forEach(room => {
        if (room.status == "vacant") {
          this.rooms.push(room);
        }

      })
    },
    async checkRoom(innId, roomId, arrive, leave, group){
      let res = await fetch(`http://localhost:3000/api/v1/inns/${innId}/rooms/${roomId}/check?arrive_date=${arrive}&leave_date=${leave}&group_size=${group}`)
      this.reservation = await res.json()
    }
  }
})

app.mount('#app');