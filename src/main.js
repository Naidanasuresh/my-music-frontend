
    const playlistbtn=document.getElementById('playlistbtn')
    const homebtn=document.getElementById('homebtn')

    const nextbtn=document.getElementById('nextBtn')
    const prevbtn=document.getElementById('prevBtn')
    const slides=document.querySelectorAll('.slide')



    const articles=document.querySelectorAll('.articles')
    const songscategoryposter=document.getElementById('songscategory-poster')
    const categoryoftheSongs=document.getElementById('categoryof-song')

    const songList=document.getElementById('song-list')

    const prevSongBtn=document.querySelector('.prevbtn')
    const playPauseBtn=document.querySelector('.playPausebtn')

    const nextSongBtn=document.querySelector('.nextbtn')

    const footerPlayBtns=document.querySelector('.playbtns')


    const progressBar=document.getElementById('progressBar')
    const footerPoster=document.getElementById('footer-poster')
    const footerTitle = document.getElementById('title')

    let currentAudio = new Audio()
    let currentBtn = null
    let currentSong = null
    let currentIndex=0
    let allbuttons=[]
    let currentSongs=[]
    const BASE_URL = import.meta.env.VITE_API_URL;
    console.log(BASE_URL)

    let index=0;
    //slides update
    function updateSlice(){
        slides.forEach((slide,i)=>{
            slide.classList.remove("active","prev")
        if (i===index){
            slide.classList.add("active")

        }
        else if(i<index){
            slide.classList.add("prev")
        }

        })

    }

    nextbtn.addEventListener('click', ()=>{

        index=(index+1)%slides.length
        updateSlice()
    })

    prevbtn.addEventListener('click', ()=>{
        index=(index-1+slides.length)%slides.length
        updateSlice()
    })




    //navigation
    homebtn.addEventListener('click',function(e){
        e.preventDefault()
        document.getElementById('homepage').style.display='block';
        document.getElementById('playlistpage').style.display='none'
        document.getElementById('songpage').style.display = 'none'

    })



    playlistbtn.addEventListener('click', function(e){
        e.preventDefault()
        document.getElementById('homepage').style.display='none'
        document.getElementById('songpage').style.display='none'
        document.getElementById('playlistpage').style.display='block'
    })






    articles.forEach((article)=>{
        article.addEventListener('click', async ()=>{
            const category=article.dataset.category

            //hide playlist
            document.getElementById('playlistpage').style.display='none'
            //show songpage
            document.getElementById('songpage').style.display='block'

            //set title

            categoryoftheSongs.innerText=category

            //set poster

            if(category==='Heart Break'){
                songscategoryposter.src='/images/download (10).jpg'

            }

            else if(category==="Love"){
                songscategoryposter.src='/images/download (6).jpg'
            }
            else if(category==='Motivation'){
                songscategoryposter.src='/images/Tommy Shelby Motivation🔥.jpg'

            }
            else{
                songscategoryposter.src='/images/kollywood music.jpg'
            }

            try {
            const response=await fetch(`${BASE_URL}/api/songs`)
            const data= await response.json()
            console.log("Clicked:", category)
            console.log("API:", data.map(s => s.category))

            let filtereddata
            if(category==='All Telugu Songs'){
                filtereddata=data
            }
            else{
                filtereddata= data.filter(
            song => song.category.trim().toLowerCase() === category.trim().toLowerCase()
            )
            } 
            renderSongs(filtereddata)
            
        } catch (error) {
            console.log(error.message)
            
        }
            


        })

    })




    //main play function
    function playSong(i){
        const song=currentSongs[i]
        currentAudio.pause()
        if(currentBtn){
            currentBtn.innerText='▶'
        }
        currentAudio=new Audio (`${BASE_URL}${song.audio}`)
        currentAudio.play()
        currentIndex=i
        // UI update
        footerTitle.innerText=song.title
        footerPoster.src=`${BASE_URL}${song.image}`
        currentSong=song.audio

        document.getElementById('title').innerText=song.title
        const btn=allbuttons[i]

        if(btn){
            btn.innerText='⏸'
            currentBtn=btn

        }
        playPauseBtn.innerText = '⏸'

        

        currentAudio.onended=()=>{
        
            nextSong()
        }
    }

    // ⏭ next

    function nextSong(){
        if (currentSongs.length===0) return
        currentIndex=(currentIndex+1)%currentSongs.length
        allbuttons[currentIndex].click()
    }

    // ⏮ prev

    function prevSong(){
        if(currentSongs.length===0) return
        currentIndex=(currentIndex-1+currentSongs.length)%currentSongs.length 
        allbuttons[currentIndex].click()
    }


    const renderSongs=(songs)=>{
        songList.innerHTML=''
        allbuttons=[]
        currentSongs=songs
        songs.forEach((song,i)=>{
            const li=document.createElement('li')
            li.classList.add('liitems')
            li.innerHTML=`
            <img src="${BASE_URL}${song.image}"/>
            <span>${song.title}</span>`

            const btn=document.createElement('button')
            btn.innerText='▶'
            
            btn.classList.add('playbtninsongpage')
        

            allbuttons.push(btn)

            //  play/pause logic

            btn.addEventListener('click',(e)=>{
                e.stopPropagation()//prevents li click
                //if same song clicked
                if (currentIndex===i){
                        // make sure currentBtn is correct
                        currentBtn=allbuttons[i]
                        if(currentAudio.paused){
                            currentAudio.play()
                            currentBtn.innerText='⏸'
                            playPauseBtn.innerText = '⏸'

                        }
                        else{
                            currentAudio.pause()
                            currentBtn.innerText='▶'
                            playPauseBtn.innerText = '⏸'    
                        }
                        
                        
                    
                    
                }
                
                else{
                    playSong(i)

                
                
                    }

                })

            

            li.appendChild(btn)
            songList.append(li)
        })


    }

    //footer

    //footer play/pause

    playPauseBtn.addEventListener('click', ()=>{

        if (currentSongs.length===0) return 
        if (!currentAudio.src){
            playSong(0)
            playPauseBtn.innerText='⏸'
            return

        }
        //toggle

        if(currentAudio.paused){
            currentAudio.play()
            playPauseBtn.innerText='⏸'
            if (currentBtn) currentBtn.innerText='⏸'
        }else{
            currentAudio.pause()
            playPauseBtn.innerText='▶'
            if (currentBtn) currentBtn.innerText='▶'
        }
        
    })

    nextSongBtn.addEventListener('click', ()=>{
        if(currentSongs.length==0) return
        currentIndex=(currentIndex+1)%currentSongs.length
        playSong(currentIndex)
        playPauseBtn.innerText = '⏸'

    })

    prevSongBtn.addEventListener('click',()=>{
        if (currentSongs.length === 0) return

        currentIndex = (currentIndex - 1 + currentSongs.length) % currentSongs.length
        playSong(currentIndex)

        playPauseBtn.innerText = '⏸'
    })

