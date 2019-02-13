cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.SpriteFrame
        },

        title: {
            default: null,
            type: cc.SpriteFrame
        },

        logo: {
            default: null,
            type: cc.AnimationClip
        },

        spriteImg: {
            default: null,
            type: cc.SpriteFrame
        },

        leftGrass: {
            default: null,
            type: cc.SpriteFrame
        },

        rightGrass: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    onLoad() {
        // 获取常驻节点
        //var pageControl = cc.find("pageControl");

        if(this.background){
            if(!this.node.getComponent(cc.Sprite).spriteFrame){
                this.node.getComponent(cc.Sprite).spriteFrame = this.background;
            }
            
        }

        if(this.title){
            var sprite = this.node.getChildByName("title").getComponent(cc.Sprite);
            if(!sprite.spriteFrame){
                sprite.spriteFrame = this.title;
            } 
        }

        if(this.logo){
            var sprite = this.node.getChildByName("logo").getComponent(cc.Animation);
            if(!sprite.defaultClip){
                sprite.addClip(this.logo);
                sprite.play('logo');
            }
            // 加载 AnimationClip
            // var self = this;
            // cc.loader.loadRes("Animation/logo", function (err, clip) {
            //     console.log(clip);
            //     //self.node.getChildByName("logo").getComponent(cc.Animation).addClip(clip, "logo");
            //     var sprite = self.node.getChildByName("logo").getComponent(cc.Animation);
            //     sprite.addClip(clip);
            //     sprite.play('logo');
            // });

        }

        if(this.spriteImg){
            var sprite = this.node.getChildByName("spriteImg").getComponent(cc.Sprite);
            if(!sprite.spriteFrame){
                sprite.spriteFrame = this.spriteImg;
            } 
        }

        if(this.leftGrass){
            var sprite = this.node.getChildByName("leftGrass").getComponent(cc.Sprite);
            if(!sprite.spriteFrame){
                sprite.spriteFrame = this.leftGrass;
            } 
        }

        if(this.rightGrass){
            var sprite = this.node.getChildByName("rightGrass").getComponent(cc.Sprite);
            if(!sprite.spriteFrame){
                sprite.spriteFrame = this.rightGrass;
            } 
        }
    }
});
