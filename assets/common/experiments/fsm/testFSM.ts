import { ydlxFSM } from "./ydlxFSM";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends ydlxFSM {
    protected onEnterIdle(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onEnterIdle');
    }
    protected onLeaveIdle(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onLeaveIdle');
    }
    protected onEnterRun(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onEnterRun');
    }
    protected onLeaveRun(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onLeaveRun');
    }
    protected onEnterAttack(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onEnterAttack');
    }
    protected onLeaveAttack(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onLeaveAttack');
    }
    protected onBeforeIdleToRun(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onBeforeIdleToRun');
    }
    protected onAfterIdleToRun(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onAfterIdleToRun');
    }
    protected onBeforeRunToAttack(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onBeforeRunToAttack');
    }
    protected onAfterRunToAttack(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onAfterRunToAttack');
    }
    protected onBeforeAttackToIdle(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onBeforeAttackToIdle');
    }
    protected onAfterAttackToIdle(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onAfterAttackToIdle');
    }
    protected onEnterGlobal(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onEnterGlobal');
    }
    protected onLeaveGlobal(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onLeaveGlobal');
    }
    protected onBeforeGlobal(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onBeforeGlobal');
    }
    protected onAfterGlobal(eventName: string, from: string, to: string, ...args: any[]): void {
        cc.log('onAfterGlobal');
    }

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

            this.fsmStartUp();

            this.fsmTrigger(this.eventName.IdleToRun);
            // this.fsmTrigger(this.eventName.RunToAttack);
            // this.fsmTrigger(this.eventName.AttackToIdle);
    }

    start () {

    }

    // update (dt) {}
}
