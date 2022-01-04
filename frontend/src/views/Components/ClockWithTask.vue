<template>
    <div style="position: relative;">

        <div class="d-flex justify-content-center">
            <canvas id="clock" :style=" isDark == true? 'background: #2e3134 !important;': 'background: white;'"> </canvas>
        </div>
        
    </div>
    
</template>

<script>
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    // import {BCard} from 'bootstrap-vue'
    
    export default {
        components:{
        },
        data() {
            return {
                arrayOfAngles: null,
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
                        const cas = `${hoursStart  }:${  minutesStart  } -> ${  hoursEnd  }:${  minutesEnd}`
                        currentNivo.push({'start': kotStart, 'end': kotEnd, 'time': cas, event})
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
                                
                                if (elemntsOnNivo.end < elemntsOnNivo.start && prekriva) {
                                    nivo = arrayTimes.length
                                }
                            }

                        }


                        if (arrayTimes.length - 1 < nivo) {
                            const currentNivo = []
                            const cas = `${hoursStart  }:${  minutesStart  } -> ${  hoursEnd  }:${  minutesEnd}`
                            currentNivo.push({'start': kotStart, 'end': kotEnd, 'time': cas, event})
                            arrayTimes.push(currentNivo)
                            nivo = arrayTimes.length - 1
                        } else {
                            const cas = `${hoursStart  }:${  minutesStart  } -> ${  hoursEnd  }:${  minutesEnd}`
                            arrayTimes[nivo].push({'start': kotStart, 'end': kotEnd, 'time': cas, event})
                        }
                    }

                    let line = 6
                    let colorAlpha = 1
                    const currentTime = this.moment()
                    const currentHours = currentTime.hour()

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

                this.arrayOfAngles = arrayTimes

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
            },
            degrees_to_radians(degrees)             {
                return degrees * (Math.PI / 180)
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

            CanvasRenderingContext2D.prototype.wrapText = function(text, x, y, maxWidth, lineHeight) {

                const lines = text.split('\n')
                let lineNumber = 0

                for (let i = 0; i < lines.length && lineNumber <= 4; i++) {

                    const words = lines[i].split(' ')
                    let line = ''

                    for (let n = 0; n < words.length; n++) {
                        const testLine = `${line + words[n]  } `
                        const metrics = this.measureText(testLine)
                        const testWidth = metrics.width
                        if (testWidth > maxWidth && n > 0) {
                            this.fillText(line, x, y)
                            line = `${words[n]  } `
                            y += lineHeight
                            lineNumber++
                            if (lineNumber >= 4) {
                                break
                            }
                        } else {
                            line = testLine
                        }
                    }

                    this.fillText(line, x, y)
                    y += lineHeight
                    lineNumber++
                }
            }

            this.canvas = document.getElementById('clock')
            this.ctx = this.canvas.getContext('2d')

            let width = window.innerWidth * 0.9

            if (width > 400) width = 600

            this.ctx.canvas.width  = width
            this.ctx.canvas.height = width


            const insThis1 = this
            this.canvas.addEventListener('mousemove', e => {
                insThis1.drawWatch()

                const x = e.offsetX
                const y = e.offsetY

                const slope1 = (300 - 300) / (300 - 0)
                const slope2 = (300 - y) / (300 - x)
                const angleRad = (slope1 - slope2) / (1 + (slope1 * slope2))
                let angle = Math.atan(angleRad) * 180 / Math.PI
                let mirrorAngle = angle
                if (x > 300 && y > 300) {
                    angle = 360 + angle
                } else if (x < 300 && y > 300) {
                    angle = 180 + angle
                } else if (x < 300 && y < 300) {
                    angle = 180 + angle
                }
                let yOnCircle = 0
                let xOnCircle = 0
                let subX = 0
                let subY = 0

                let smerX = false
                let smerY = false

                if (x > 300 && y > 300) {
                    smerX = true
                    smerY = true
                    mirrorAngle = 90 - mirrorAngle
                } else if (x < 300 && y > 300) {
                    smerX = false
                    smerY = true
                    mirrorAngle = 270 - mirrorAngle
                } else if (x < 300 && y < 300) {
                    smerX = false
                    smerY = false
                    mirrorAngle = 270 - mirrorAngle
                } else if (x > 300 && y < 300) {
                    smerX = true
                    smerY = false
                    mirrorAngle = 90 - mirrorAngle
                }

                for (const nivo in insThis1.arrayOfAngles) {

                    for (const ele of insThis1.arrayOfAngles[nivo]) {

                        if (ele.end < ele.start) {
                            if ((mirrorAngle >= ele.start && mirrorAngle <= 360) || (mirrorAngle <= ele.end)) {
                                yOnCircle = (this.r + 25 + (25 * nivo)) * Math.sin(insThis1.degrees_to_radians(angle))
                                xOnCircle = (this.r + 25 + (25 * nivo)) * Math.cos(insThis1.degrees_to_radians(angle))

                                subX = x - 300 - xOnCircle
                                subY = 300 - y - yOnCircle

                                if (Math.abs(subX + subY) < 5) {
                                    let xMin = 0, yMin = 0

                                    if (smerX) {
                                        xMin = x - 200
                                    } else {
                                        xMin = x
                                    }

                                    if (smerY) {
                                        yMin = y - 150
                                    } else {
                                        yMin = y
                                    }
                                   

                                    this.ctx.beginPath()
                                    this.ctx.rect(xMin, yMin, 200, 150)

                                    if (insThis1.isDark) {
                                        this.ctx.strokeStyle = '#282a2d'
                                        this.ctx.fillStyle = '#282a2d'
                                    } else {
                                        this.ctx.strokeStyle = '#e7efef'
                                        this.ctx.fillStyle = '#e7efef'
                                    }
                                    this.ctx.stroke()
                                    this.ctx.fill()

                                    const centerPointX = xMin + (200 / 2)
                                    const centerPointY = yMin + 30


                                    this.ctx.beginPath()
                                    this.ctx.textAlign = 'center'
                                    this.ctx.font = '15px Arial'
                                    this.ctx.fillStyle = 'white'
                                    this.ctx.wrapText(ele.time, centerPointX, centerPointY, 180, 20)
                                    this.ctx.fill()


                                    this.ctx.beginPath()
                                    this.ctx.fillStyle = ele.event.color
                                    this.ctx.arc(xMin + 10, centerPointY + 25, 5, 0, 2 * Math.PI)
                                    this.ctx.fill()

                                    this.ctx.beginPath()
                                    this.ctx.textAlign = 'start'
                                    this.ctx.fillStyle = 'white'
                                    this.ctx.wrapText(ele.event.name, xMin + 25, centerPointY + 30, 180, 20)
                                

                                    this.ctx.beginPath()
                                    this.ctx.fill()
                                    this.ctx.stroke()

                                }
                            }
                        } else if (mirrorAngle >= ele.start && mirrorAngle <= ele.end) {
                            yOnCircle = (this.r + 25 + (25 * nivo)) * Math.sin(insThis1.degrees_to_radians(angle))
                            xOnCircle = (this.r + 25 + (25 * nivo)) * Math.cos(insThis1.degrees_to_radians(angle))

                            subX = x - 300 - xOnCircle
                            subY = 300 - y - yOnCircle

                            if (Math.abs(subX + subY) < 5) {
                                let xMin = 0, yMin = 0
                               
                                if (smerX) {
                                    xMin = x - 200
                                } else {
                                    xMin = x
                                }

                                if (smerY) {
                                    yMin = y - 150
                                } else {
                                    yMin = y
                                }

                                insThis1.ctx.beginPath()
                                this.ctx.roundRect(xMin, yMin, 200, 150, 5)

                                if (insThis1.isDark) {
                                    this.ctx.strokeStyle = '#282a2d'
                                    this.ctx.fillStyle = '#282a2d'
                                } else {
                                    this.ctx.strokeStyle = '#e7efef'
                                    this.ctx.fillStyle = '#e7efef'
                                }
                                this.ctx.stroke()
                                this.ctx.fill()

                                const centerPointX = xMin + (200 / 2)
                                const centerPointY = yMin + 30


                                this.ctx.beginPath()
                                this.ctx.textAlign = 'center'
                                this.ctx.font = '15px Arial'
                                this.ctx.fillStyle = 'white'
                                this.ctx.wrapText(ele.time, centerPointX, centerPointY, 180, 20)
                                this.ctx.fill()


                                this.ctx.beginPath()
                                this.ctx.fillStyle = ele.event.color
                                this.ctx.arc(xMin + 10, centerPointY + 25, 5, 0, 2 * Math.PI)
                                this.ctx.fill()

                                this.ctx.beginPath()
                                this.ctx.textAlign = 'start'
                                this.ctx.fillStyle = 'white'
                                this.ctx.wrapText(ele.event.name, xMin + 25, centerPointY + 30, 180, 20)
                                

                                this.ctx.beginPath()
                                this.ctx.fill()
                                this.ctx.stroke()
                            }
                        }
                    }
                }

            }, false)

            this.drawWatch(true)
           
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