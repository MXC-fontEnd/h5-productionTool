
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(sp.Skeleton)
export default class SpineCollider extends cc.Component {

    private skeleton: sp.Skeleton;
    private colliders = {}

    protected onLoad() {
        this.skeleton = this.node.getComponent(sp.Skeleton);
    }

    protected update(dt) {
        let slots/*: sp.spine.Slot[]*/ = (<any>this.skeleton)._skeleton.slots;
        for (let i = 0; i < slots.length; ++i) {
            let slot/*: sp.spine.Slot*/ = slots[i];
            let attachment/*: sp.spine.BoundingBoxAttachment*/ = slot.attachment;

            if (!this.colliders[i]) {
                if (!attachment || !(attachment instanceof (<any>sp).spine.BoundingBoxAttachment)) continue;
                let node = new cc.Node(attachment.name);
                node.groupIndex = this.node.groupIndex;
                this.node.addChild(node);
                this.colliders[i] = node.addComponent(cc.PolygonCollider);
            } else if (!attachment || !(attachment instanceof (<any>sp).spine.BoundingBoxAttachment)) {
                this.colliders[i].node.active && (this.colliders[i].node.active = false);
                continue;
            }

            let collider: cc.PolygonCollider = this.colliders[i];

            !collider.node.active && (collider.node.active = true);
            collider.node.x = slot.bone.worldX;
            collider.node.y = slot.bone.worldY;

            let currentBone = slot.bone;
            let rotation = 0;
            let scaleX = 1;
            let scaleY = 1;
            while (currentBone) {
                rotation -= currentBone.rotation;
                scaleX *= currentBone.scaleX;
                scaleY *= currentBone.scaleY;
                currentBone = currentBone.parent;
            }
            collider.node.rotation = rotation;
            collider.node.scaleX = scaleX;
            collider.node.scaleY = scaleY;

            while (collider.points.length > attachment.vertices.length / 2) collider.points.pop();
            for (let i = 0; i < attachment.vertices.length / 2; ++i) {
                if (collider.points[i]) {
                    collider.points[i].x = attachment.vertices[i * 2];
                    collider.points[i].y = attachment.vertices[i * 2 + 1];
                } else {
                    collider.points[i] = cc.v2(attachment.vertices[i * 2], attachment.vertices[i * 2 + 1]);
                }
            }
        }
    }

}