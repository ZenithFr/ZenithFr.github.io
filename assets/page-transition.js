// page-transition.js
// Handles the cinematic loader and cross-page GSAP transitions

// Ensure GSAP is available before executing
function initPageTransitions() {
    if (typeof gsap === 'undefined') {
        setTimeout(initPageTransitions, 50);
        return;
    }

    // Create the premium transition overlay dynamically
    const overlay = document.createElement("div");
    overlay.id = "premium-transition-overlay";
    Object.assign(overlay.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "#050505", // Deep luxury dark
        zIndex: "999999",
        pointerEvents: "auto", // Block interactions while loading
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        transformOrigin: "bottom" // For scaling up/down
    });

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none"
    });
    overlay.appendChild(canvas);

    const loaderContent = document.createElement("div");
    Object.assign(loaderContent.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
    });

    const logoContainer = document.createElement("div");
    Object.assign(logoContainer.style, {
        fontSize: "3rem",
        fontWeight: "900",
        letterSpacing: "0.2em",
        display: "flex",
        overflow: "hidden" // For text reveal
    });
    
    // Zenith text split for animation
    const text = "ZENITH";
    text.split('').forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        span.className = "loader-char";
        span.style.display = "inline-block";
        span.style.transform = "translateY(100%)";
        logoContainer.appendChild(span);
    });

    const progressBarContainer = document.createElement("div");
    Object.assign(progressBarContainer.style, {
        width: "200px",
        height: "2px",
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
        position: "relative",
        marginTop: "20px"
    });

    const progressBar = document.createElement("div");
    Object.assign(progressBar.style, {
        width: "0%",
        height: "100%",
        backgroundColor: "#ffffff",
        position: "absolute",
        left: 0,
        top: 0
    });

    progressBarContainer.appendChild(progressBar);
    loaderContent.appendChild(logoContainer);
    loaderContent.appendChild(progressBarContainer);
    overlay.appendChild(loaderContent);
    document.body.appendChild(overlay);

    // Lock scroll during load
    document.body.style.overflow = "hidden";

    // Simulate a longer, premium cinematic first-load
    gsap.to(".loader-char", {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        delay: 0.2,
        onComplete: () => {
            // Passive glowing wave while loading
            gsap.to(".loader-char", {
                textShadow: "0px 0px 20px rgba(255,255,255,0.8)",
                opacity: 0.7,
                duration: 1,
                stagger: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    });

    let progress = 0;
    
    // --- 3D Particle Warp Logic (Three.js) ---
    // Make sure THREE is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping 3D warp.');
        return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.001); // Deep void fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    function resizeCanvas() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resizeCanvas);

    // Create 3D particles
    const numStars = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numStars * 3);
    const velocities = new Float32Array(numStars);

    for (let i = 0; i < numStars; i++) {
        positions[i * 3] = Math.random() * 2000 - 1000; // x
        positions[i * 3 + 1] = Math.random() * 2000 - 1000; // y
        positions[i * 3 + 2] = Math.random() * 2000 - 1000; // z
        velocities[i] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circular glowing particle material
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const starCloud = new THREE.Points(geometry, material);
    scene.add(starCloud);

    let warpSpeed = 1;
    let animationFrameId;

    function animateStars() {
        animationFrameId = requestAnimationFrame(animateStars);

        const positions = starCloud.geometry.attributes.position.array;
        
        for (let i = 0; i < numStars; i++) {
            velocities[i] += warpSpeed * 0.02; // Acceleration effect
            const zSpeed = warpSpeed * 2 + velocities[i];
            
            positions[i * 3 + 2] += zSpeed; // Move towards camera

            // If particle passes the camera, reset it far back
            if (positions[i * 3 + 2] > 1000) {
                positions[i * 3] = Math.random() * 2000 - 1000;
                positions[i * 3 + 1] = Math.random() * 2000 - 1000;
                positions[i * 3 + 2] = -1000;
                velocities[i] = 0;
            }
        }

        starCloud.geometry.attributes.position.needsUpdate = true;
        
        // Very subtle camera rotation for more dynamic feel
        starCloud.rotation.z += 0.001;
        
        // Stretch particles on Z axis based on speed for warp streaks
        // (Fake it by moving camera slightly or using a custom shader, but we'll stick to speed blur via speed)

        renderer.render(scene, camera);
    }
    animateStars();
    // ----------------------------------

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 3) + 1;
        if (progress > 100) progress = 100;
        gsap.to(progressBar, { width: `${progress}%`, duration: 0.1 });

        // Ramp up warp speed dynamically as progress increases
        gsap.to({s: warpSpeed}, {
            s: 1 + (progress / 100) * 20, // Huge 3D acceleration
            duration: 0.1,
            onUpdate: function() { warpSpeed = this.targets()[0].s; }
        });

        if (progress === 100) {
            clearInterval(interval);
            // Engage 3D hyperdrive
            gsap.to({s: warpSpeed}, {
                s: 100, 
                duration: 0.8,
                ease: "power3.in",
                onUpdate: function() { warpSpeed = this.targets()[0].s; }
            });
            setTimeout(finishLoading, 800);
        }
    }, 40);

    function finishLoading() {
        const tl = gsap.timeline({
            onComplete: () => {
                overlay.style.pointerEvents = "none";
                document.body.style.overflow = "";
            }
        });

        tl.to(loaderContent, {
            opacity: 0,
            scale: 1.2,
            filter: "blur(10px)",
            duration: 0.8,
            ease: "power2.in"
        })
        .to(overlay, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onStart: () => {
                // Dispatch event here so hero animation starts smoothly while overlay dissolves
                window.dispatchEvent(new Event("zenith-loaded"));
            },
            onComplete: () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resizeCanvas);
                // Clean up Three.js contexts
                geometry.dispose();
                material.dispose();
                renderer.dispose();
                overlay.remove(); // Remove overlay completely
            }
        }, "-=0.4");
    }

    // Intercept local links for exit transition
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        // Check if it's an internal link
        if (
            href && 
            !href.startsWith("#") && 
            !href.startsWith("mailto:") && 
            !href.startsWith("http") &&
            link.target !== "_blank"
        ) {
            e.preventDefault();

            // Exit transition: overlay slides up from bottom
            const exitTl = gsap.timeline({
                onComplete: () => {
                    window.location.href = href;
                }
            });

            gsap.set(overlay, { scaleY: 0, transformOrigin: "bottom" });
            gsap.set(loaderContent, { opacity: 0, y: 30 });

            exitTl.to(overlay, {
                scaleY: 1,
                duration: 1,
                ease: "expo.inOut"
            })
            .to(loaderContent, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out"
            }, "-=0.5");
        }
    });
}

document.addEventListener("DOMContentLoaded", initPageTransitions);
