<template>
    <div>
        <canvas id="clock" style="background: #2e3134;"> </canvas>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                canvas: null,
                ctx: null,
                center: null,
                r: null

            }
        },
        methods:{
            toRadians(degrees)             {
                const pi = Math.PI
                return (degrees - 90) * (pi / 180)
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
            console.log(this.ctx.canvas.width)
            this.ctx.canvas.width  = 500
            this.ctx.canvas.height  = 500

            this.center = this.ctx.canvas.height / 2
            this.r = (this.ctx.canvas.height / 2) * 0.7

            // rdeca fe5c36
            // MODRA 53afbe
            // RUMENA feb449

            //Sama kroznica ura
            this.ctx.beginPath()
            this.ctx.strokeStyle = '#fff'
            this.ctx.lineWidth = 3
            this.ctx.arc(this.center, this.center, this.r, 0, 2 * Math.PI)
            this.ctx.stroke()
         
            //Digitalni prikaz ure
            // this.ctx.textAlign = 'center'
            // this.ctx.font = '95px Arial'
            // this.ctx.fillStyle = '#fff'
            // this.ctx.fillText('12:40', this.center, this.center + 33)

            // this.ctx.strokeStyle = '#feb449'

            // Urni Kazalec
            this.ctx.save()
            this.ctx.translate(this.center, this.center)
            this.ctx.rotate(30 * Math.PI / 180)
            this.ctx.beginPath()       
            this.ctx.lineCap = 'round'
            this.ctx.fillStyle = '#2e3134'
            this.ctx.roundRect(0, -5, 90, 10, 10)
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.restore()


            const kot = 350
            
            // Minutni Kazalec
            this.ctx.save()
            this.ctx.translate(this.center, this.center)
            this.ctx.rotate((-90 + kot) * Math.PI / 180)
            this.ctx.beginPath()       
            this.ctx.lineCap = 'round'
            this.ctx.fillStyle = '#2e3134'
            this.ctx.roundRect(0, -5, 120, 10, 10)
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.restore()


            // Krogec v sredini
            this.ctx.beginPath()
            this.ctx.strokeStyle = '#fff'
            this.ctx.lineWidth = 10
            this.ctx.arc(this.center, this.center, 5, 0, 2 * Math.PI)
            this.ctx.stroke()
            this.ctx.fillStyle = '#2e3134'
            this.ctx.fill()
            this.ctx.fillStyle = '#fff'

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
                this.ctx.stroke()
                this.ctx.fillStyle = '#fff'
                this.ctx.fill()
                
            }


            this.ctx.lineCap = 'round'
            this.ctx.beginPath()
            this.ctx.strokeStyle = 'rgba(5, 183, 237, 0.15)'
            this.ctx.lineWidth = 6
            this.ctx.arc(this.center, this.center, this.r + 25, this.toRadians(0), this.toRadians(90))


            this.ctx.stroke()
            this.ctx.beginPath() 
            this.ctx.strokeStyle = '#ed8105'
            this.ctx.lineWidth = 10
            this.ctx.arc(this.center, this.center, this.r + 25, this.toRadians(105), this.toRadians(140))
            this.ctx.stroke()

            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.strokeStyle = 'rgba(245, 108, 17, 0.15)'
            this.ctx.lineWidth = 6
            this.ctx.arc(this.center, this.center, this.r + 25, this.toRadians(170), this.toRadians(250))
            this.ctx.stroke()

            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.strokeStyle = '#47ed05'
            this.ctx.lineWidth = 10
            this.ctx.arc(this.center, this.center, this.r + 25, this.toRadians(270), this.toRadians(340))
            this.ctx.stroke()

            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.strokeStyle = '#edd605'
            this.ctx.lineWidth = 10
            this.ctx.arc(this.center, this.center, this.r + (50), this.toRadians(40), this.toRadians(170))
            this.ctx.stroke()

            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.strokeStyle = '#2fa4a8'
            this.ctx.lineWidth = 10
            this.ctx.arc(this.center, this.center, this.r + (50), this.toRadians(200), this.toRadians(360))
            this.ctx.stroke()


        }
    }
</script>

<style scoped>

</style>