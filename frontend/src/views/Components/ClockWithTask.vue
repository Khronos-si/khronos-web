<template>
    <div class="d-flex justify-content-center">
        <canvas id="clock" :style=" isDark == true? 'background: #2e3134 !important;': 'background: white;'"> </canvas>
    </div>
</template>

<script>
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    
    export default {
        data() {
            return {
                interval: null,
                canvas: null,
                ctx: null,
                center: null,
                r: null

            }
        },
        props:{
            events: {
                type: Array
            }
        },
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        methods:{
            toRadians(degrees) {

                while (degrees > 360) {
                    degrees -= 360
                }

                const pi = Math.PI
                return (degrees - 90) * (pi / 180)
            },
            drawTasks() {
                
                const arrayTimes = []
                console.log(this.events)

                for (const event of this.events) {
                    const timeStart = this.moment(event.dates.start)
                    const hoursStart = timeStart.hour()
                    const minutesStart = timeStart.minutes()

                    let timeEnd = null
                    if (event.dates.customEnd) timeEnd = this.moment(event.dates.customEnd)
                    else timeEnd = this.moment(event.dates.end)


                    const hoursEnd = timeEnd.hour()
                    const minutesEnd = timeEnd.minutes()

                    let kotStart = (hoursStart * 30) + ((minutesStart) * 0.5)

                    if (hoursStart >= 12) {
                        kotStart = ((hoursStart - 12) * 30) + ((minutesStart) * 0.5)

                    }

                    let kotEnd = (hoursEnd * 30) + ((minutesEnd) * 0.5)

                    if (hoursEnd >= 12) {
                        kotEnd = ((hoursEnd - 12) * 30) + ((minutesEnd) * 0.5)

                    }

                    let nivo = 0
                    

                    if (arrayTimes.length === 0) {
                        const currentNivo = []
                        currentNivo.push({'start': kotStart, 'end': kotEnd})
                        arrayTimes.push(currentNivo)
                    } else {
                        for (const currentNivo of arrayTimes) {
                            for (const elemntsOnNivo of currentNivo) {
                                
                                let forKot = []
                                let currentKot = []

                                if (elemntsOnNivo.end < elemntsOnNivo.start) {
                                    forKot.push({start: elemntsOnNivo.start, end: 360})
                                    forKot.push({start: 0, end: elemntsOnNivo.end})
                                } else {
                                    forKot = [{start: elemntsOnNivo.start, end: elemntsOnNivo.end}]
                                }

                                if (kotEnd < kotStart) {
                                    currentKot.push({start: kotStart, end: 360})
                                    currentKot.push({start: 0, end: kotEnd})
                                } else {
                                    currentKot = [{start: kotStart, end: kotEnd}]
                                }

                                let prekriva = false
                                for (const objectKot of forKot) {
                                    
                                    if ((objectKot.start < currentKot[0].start && objectKot.end > currentKot[0].start) || (objectKot.start < currentKot[0].end && objectKot.end > currentKot[0].end)) {
                                        prekriva = true
                                    }

                                    if ((currentKot[0].start < objectKot.start && objectKot.end < currentKot[0].end)) {
                                        prekriva = true
                                    }

                                    if (currentKot.length === 2) {
                                        if ((objectKot.start < currentKot[1].start && objectKot.end > currentKot[1].start) || (objectKot.start < currentKot[1].end && objectKot.end > currentKot[1].end)) {
                                            prekriva = true
                                        }

                                        if ((currentKot[1].start < objectKot.start && objectKot.end < currentKot[1].end)) {
                                            prekriva = true
                                        }
                                    }
                                }

                                if (prekriva) {
                                    nivo++
                                } 

                            }

                        }


                        if (arrayTimes.length - 1 < nivo) {
                            const currentNivo = []
                            currentNivo.push({'start': kotStart, 'end': kotEnd})
                            arrayTimes.push(currentNivo)
                            nivo = arrayTimes.length - 1
                        } else {
                            arrayTimes[nivo].push({'start': kotStart, 'end': kotEnd})
                        }
                    }

                    let line = 6
                    let colorAlpha = 1
                    const currentTime = this.moment()
                    const currentHours = currentTime.hour()

                    console.log(`CURRENT H: ${  currentHours}`)
                    console.log(`Start H: ${  hoursStart}`)
                    console.log(`end H: ${  hoursEnd}`)


                    if ((currentHours > 12 && hoursStart < 12 && currentHours > hoursEnd) || (currentHours < 12 && hoursStart > 12)) {
                        line = 3
                        colorAlpha = 0.15
                    }


                    const color = this.hexToRgb(event.color)
                    this.ctx.lineCap = 'round'
                    this.ctx.beginPath()
                    this.ctx.strokeStyle = `rgba(${  color.r  },${  color.g  },${  color.b  }, ${  colorAlpha  })`
                    this.ctx.lineWidth = line
                    this.ctx.arc(this.center, this.center, this.r + 25 + (25 * nivo), this.toRadians(kotStart), this.toRadians(kotEnd))
                    this.ctx.stroke()
                }
                console.log(arrayTimes)
                
            },
            hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null
            },
            drawWatch(analog = true) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

                this.center = this.ctx.canvas.width / 2
                this.r = (this.ctx.canvas.width / 2) * 0.6

                //Sama kroznica ura
                this.ctx.beginPath()
                if (this.isDark) this.ctx.strokeStyle = 'white'
                else this.ctx.strokeStyle = '#2e3134'

                this.ctx.lineWidth = 3
                this.ctx.arc(this.center, this.center, this.r, 0, 2 * Math.PI)
                this.ctx.stroke()
         
                const currentTime = this.moment()
                let currentHours = currentTime.hour()
                const currentMinutes = currentTime.minutes()

                if (currentHours > 12) currentHours -= 12

                const kotUre = (currentHours * 30) + (currentMinutes * 0.5)
                const kotMinute =  (currentMinutes * 6)

                // const kotMinute = 350
                
                // Urni Kazalec
                if (analog) {
                    this.ctx.save()
                    this.ctx.translate(this.center, this.center)
                    this.ctx.rotate((-90 + kotUre) * Math.PI / 180)
                    this.ctx.beginPath()       
                    this.ctx.lineCap = 'round'
                    if (this.isDark) this.ctx.fillStyle = '#2e3134'
                    else this.ctx.fillStyle = 'white'

                    this.ctx.roundRect(0, -5, 80, 10, 10)
                    this.ctx.fill()
                    this.ctx.stroke()
                    this.ctx.restore()

                    // Minutni Kazalec
                    this.ctx.save()
                    this.ctx.translate(this.center, this.center)
                    this.ctx.rotate((-90 + kotMinute) * Math.PI / 180)
                    this.ctx.beginPath()       
                    this.ctx.lineCap = 'round'
                    if (this.isDark) this.ctx.fillStyle = '#2e3134'
                    else this.ctx.fillStyle = 'white'
                    this.ctx.roundRect(0, -5, 120, 10, 10)
                    this.ctx.fill()
                    if (this.isDark) this.ctx.strokeStyle = 'white'
                    else this.ctx.strokeStyle = '#2e3134'
                    this.ctx.stroke()
                    this.ctx.restore()

                    // Krogec v sredini
                    this.ctx.beginPath()

                    this.ctx.lineWidth = 10
                    this.ctx.arc(this.center, this.center, 5, 0, 2 * Math.PI)
                } else {
                    // Digitalni prikaz ure
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.textAlign = 'center'
                    this.ctx.font = '95px Arial'
                    this.ctx.fillStyle = 'white'
                    this.ctx.fillText('12:40', this.center, this.center + 33)
                    this.ctx.fill()
                    this.ctx.stroke()
                    this.ctx.restore()

                }

                if (this.isDark) this.ctx.strokeStyle = 'white'
                else this.ctx.strokeStyle = '#2e3134'
                this.ctx.stroke()
            
                if (this.isDark) this.ctx.fillStyle = '#2e3134'
                else this.ctx.fillStyle = 'white'

                this.ctx.fill()
            
            
                this.ctx.lineWidth = 3

                //Pikice
                for (let i = 0; i < 360; i += 360 / 12) {

                    let polna = 0

                    if (i % 90 === 0) {
                        polna = 4
                    }

                    this.ctx.beginPath()
                    const miniCircleX = (Math.sin(this.toRadians(i)) * (this.r - 30)) + this.center
                    const miniCircleY = (Math.cos(this.toRadians(i)) * (this.r - 30)) + this.center
                    this.ctx.arc(miniCircleX, miniCircleY, 4 + polna, 0, 2 * Math.PI)

                    if (this.isDark) this.ctx.fillStyle = 'white'
                    else this.ctx.fillStyle = '#2E3134'

                    this.ctx.fill()

                    if (this.isDark) this.ctx.strokeStyle = 'white'
                    else this.ctx.strokeStyle = '#2E3134'

                    this.ctx.stroke()
                
                }

                this.drawTasks()
            }
        },
        mounted() {

            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2
                if (h < 2 * r) r = h / 2
                this.beginPath()
                this.moveTo(x + r, y)
                this.arcTo(x + w, y,   x + w, y + h, r)
                this.arcTo(x + w, y + h, x,   y + h, r)
                this.arcTo(x,   y + h, x,   y,   r)
                this.arcTo(x,   y,   x + w, y,   r)
                this.closePath()
                return this
            }

            this.canvas = document.getElementById('clock')
            this.ctx = this.canvas.getContext('2d')

            let width = window.innerWidth * 0.9

            if (width > 400) width = 600

            this.ctx.canvas.width  = width
            this.ctx.canvas.height = width

            this.drawWatch(true)
            // this.ctx.canvas.width  = 500
            // this.ctx.canvas.height  = 500
            const insThis = this
            this.interval = setInterval(function() {
                insThis.drawWatch(true)
            }, 10000)

        },
        beforeDestroy() {
            clearInterval(this.interval)
        },
        watch: {
            events() {
                this.drawWatch()
            },
            isDark() {
                this.drawWatch()
            }
        }
    }
    
</script>

<style scoped>

</style>