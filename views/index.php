
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rashid's Portfolio Site</title>

    <link href="normalize.css" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Days+One&family=Work+Sans&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/portfolio_.css">
            
</head>

<body>
    
    <nav style="z-index:99">
        <ul>
            <li><a href="#aboutme">About me</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contactme">Contact me</a></li>
        </ul> 
    </nav>

    <div class="app_body">
    <section class="hero">        
        <div class="container">
            <img src="/images/2.jpeg">
            <h1>Hi I'm Rashid! Web Developer</h1>
        </div>
    </section>

    <section id="aboutme" class="aboutme">
        <h2>About me</h2>
        <div class="aboutme-section">
            <div class="img">
                <div class="aboutme-image"></div>
            </div>
            <div class="aboutme-text">
                
                <p>My past is filled with the world of dance. “Ballroom Dancing” - to be exact.
                Ballroom Dancing required traveling with studios to unbelievable places on this earth to compete, extending the opportunity to explore different countries, cultures, and open up a whole new world.</p> 

                <p>My career ended up combining dance with travel as I managed and owned several studios spanning two continents.
                Most of my life was spent in the USA, however, I ended up moving to Africa.</p> 

                <p>Several years ago, I became involved with web development as a hobby and finally decided to incorporate the newfound interest to better support myself.</p>

                <p>This has been the best decision I have made and has given me the freedom to work anywhere in this world.</p>

                <p>I am familair with HTML5, CSS3, JavaScript, PHP7, and MySQL. Check out some of the projects I've done below.</p>

            </div>
        </div>           
     
    </section>

    <section id="projects">
        <div class="project">
            <h2>Projects</h2>  
            <div class="projects">

                <div class="earth-project">
                    <div class="text">
                        <h3 class="project-name">Earth Facts</h3>
                        <div class="content">                           
                            <p>A HTML project about some facts about the earth.</p>
                        </div>

                        <a class="button" href="/mywebpage.php" target="-bank">View Project</a>
                    </div>

                </div>

                <div class="bbc-project">
                    <div class="text">
                        <h3 class="project-name">BBC News Clone</h3>
                        <div class="content">                           
                            <p>This project is a BBC News Clone</p>
                        </div>

                        <a class="button" href="/bbc.php" target="-bank">View Project</a>
                    </div>


            </div>
        </div>
    </section>

    <section id="contactme" class="contact">
        <h2>Contact</h2>
        <p>Use this form to get in touch. I would love to hear from you!</p>

        <form class="contact-form">

            <div class="contact-details">

                <label for="name">Name</label>
                <input type="text" id="yourname" placeholder="Yourname">

                <label for="subject">Subject</label>
                <input type="text" id="subject" placeholder="Reason for your message">

                <label for="email">Email Address</label>
                <input type="email" id="email" placeholder="Your email address">

            </div>

            <div class="message">

                <label for="msg">Message</label>
                <textarea id="msg" rows="15"></textarea>
                <button type="submit">Submit</button>

            </div>

            
        </form>

    </section>

    <footer>
        <div class="container">
            <div class="copyright">
                This site &copy; 2023 Rashid Mirmohamed
            </div>
            <div class="social-media">
                

                <a href="https://www.facebook.com/profile.php?id=100086994151639"><i class="fa fa-facebook-official"></i></a>
            </div>

        </div>
    </footer>
    </div>
    
</body>
</html>
