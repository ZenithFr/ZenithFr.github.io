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
        color: "#cba6f7",
        fontFamily: "'Inter', sans-serif",
        transformOrigin: "bottom" // For scaling up/down
    });

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
        backgroundColor: "#cba6f7",
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

    // Detect if this is the FIRST LOAD or a CROSS-PAGE NAVIGATION
    const isFirstLoad = !sessionStorage.getItem("zenith_loaded");

    if (isFirstLoad) {
        sessionStorage.setItem("zenith_loaded", "true");
        // Simulate a longer, premium cinematic first-load
        gsap.to(".loader-char", {
            y: "0%",
            duration: 1,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.2
        });

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1;
            if (progress > 100) progress = 100;
            gsap.to(progressBar, { width: `${progress}%`, duration: 0.1 });

            if (progress === 100) {
                clearInterval(interval);
                finishLoading();
            }
        }, 30);
    } else {
        // Quick transition from another page
        gsap.set(".loader-char", { y: "0%" });
        gsap.set(progressBar, { width: "100%" });
        setTimeout(finishLoading, 400); // Short delay to let fonts/DOM render
    }

    function finishLoading() {
        const tl = gsap.timeline({
            onComplete: () => {
                overlay.style.pointerEvents = "none";
                document.body.style.overflow = "";
                // Dispatch event so specific pages can run their entrance animations (like Hero reveal)
                window.dispatchEvent(new Event("zenith-loaded"));
            }
        });

        tl.to(loaderContent, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power3.inOut"
        })
        .to(overlay, {
            scaleY: 0,
            transformOrigin: "top", // Slide UP to reveal the page
            duration: 1.2,
            ease: "expo.inOut"
        }, "-=0.2");
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
