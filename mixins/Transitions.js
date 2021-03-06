//
//  mixins/Transition.js

export default {
    transition: {
        css: false,
        mode: "out-in",
        appear: true,
        leave(el, done) {
            this.$core.events.dispatchEvent(this.$core.events.TRANSITION_LEAVE);
            this.$core.tween({
                targets: el,
                opacity: 0,
                easing: "o1",
                duration: 350,
                complete: ()=>{
                    done();
                    this.$core.events.dispatchEvent(this.$core.events.TRANSITION_LEAVE_DONE);
                }
            });
        },
        enter(el, done) {
            this.$core.events.dispatchEvent(this.$core.events.TRANSITION_ENTER);
            this.$core.tween({
                targets: el,
                opacity: 1,
                easing: "i1",
                duration: 650,
                complete: ()=>{
                    done();
                    this.$core.events.dispatchEvent(this.$core.events.TRANSITION_ENTER_DONE);
                }
            });
        }
    }
};
