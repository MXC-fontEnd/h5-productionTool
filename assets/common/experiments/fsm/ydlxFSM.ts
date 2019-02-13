
//###{"class":"go.GraphLinksModel","globalCallbacksText":"{\"enter\":[\"onEnterGlobal\"],\"leave\":[\"onLeaveGlobal\"],\"before\":[\"onBeforeGlobal\"],\"after\":[\"onAfterGlobal\"]}","linkDataArray":[{"callbacks":"{\"before\":[\"onBeforeIdleToRun\"],\"after\":[\"onAfterIdleToRun\"]}","from":-1,"points":[39.08009310042228,-277.74580845312977,61.51982615138744,-150.25005504326825,70.71460171897553,-21.619793500852904,66.62578164757629,108.15024800697981],"text":"IdleToRun","to":-2},{"callbacks":"{\"before\":[\"onBeforeRunToAttack\"],\"after\":[\"onAfterRunToAttack\"]}","from":-2,"points":[96.97142774869086,113.59556593330989,201.51138118914085,44.710196605257515,311.1047188363656,-12.906699149508526,424.1836165393821,-59.59152544957774],"text":"RunToAttack","to":-3},{"callbacks":"{\"before\":[\"onBeforeAttackToIdle\"],\"after\":[\"onAfterAttackToIdle\"]}","from":-3,"points":[424.09409721566016,-98.32513678928167,299.89668919201364,-149.1826328395265,179.35376342361317,-211.20235211170498,64.16159901268524,-284.77894423892343],"text":"AttackToIdle","to":-1}],"nodeDataArray":[{"callbacks":"{\"enter\":[\"onEnterIdle\"],\"leave\":[\"onLeaveIdle\"]}","isInit":true,"key":-1,"loc":"-2.842170943040401e-14 -329.69999999999993","text":"Idle"},{"callbacks":"{\"enter\":[\"onEnterRun\"],\"leave\":[\"onLeaveRun\"]}","isInit":false,"key":-2,"loc":"28.35000000000008 108.15000000000003","text":"Run"},{"callbacks":"{\"enter\":[\"onEnterAttack\"],\"leave\":[\"onLeaveAttack\"]}","isInit":false,"key":-3,"loc":"418.9499999999999 -104.99999999999994","text":"Attack"}]}###
interface StateNameInterface{
    Idle:string;
    Run:string;
    Attack:string;

}
interface EventNameInterface{
    IdleToRun:string;
    RunToAttack:string;
    AttackToIdle:string;

}
import StateMachine from "./StateMachine";
export abstract class ydlxFSM  extends cc.Component  {

    private fsm:any;

    protected fsmTrigger(eventName:string,...args:any[]){
        this.fsm[eventName](...args);
    };

    protected fsmIs(stateName:string):boolean {
        return this.fsm.is(stateName);
    };

    protected fsmCan(eventName:string):boolean {
        return this.fsm.can(eventName);
    };

    protected fsmCannot(eventName:string):boolean{
        return this.fsm.cannot(eventName);
    };

    protected fsmCurrent():string{
        return this.fsm.current;
    };

    protected fsmStartUp(){
        this.fsm = StateMachine.create({"initial":"Idle","events":[{"name":"IdleToRun","from":"Idle","to":"Run"},{"name":"RunToAttack","from":"Run","to":"Attack"},{"name":"AttackToIdle","from":"Attack","to":"Idle"}],"callbacks":{"onenterIdle":[this.onEnterIdle],"onleaveIdle":[this.onLeaveIdle],"onenterRun":[this.onEnterRun],"onleaveRun":[this.onLeaveRun],"onenterAttack":[this.onEnterAttack],"onleaveAttack":[this.onLeaveAttack],"onbeforeIdleToRun":{"Idle":[this.onBeforeIdleToRun]},"onafterIdleToRun":{"Idle":[this.onAfterIdleToRun]},"onbeforeRunToAttack":{"Run":[this.onBeforeRunToAttack]},"onafterRunToAttack":{"Run":[this.onAfterRunToAttack]},"onbeforeAttackToIdle":{"Attack":[this.onBeforeAttackToIdle]},"onafterAttackToIdle":{"Attack":[this.onAfterAttackToIdle]},"onenterstate":[this.onEnterGlobal],"onleavestate":[this.onLeaveGlobal],"onbeforeevent":[this.onBeforeGlobal],"onafterevent":[this.onAfterGlobal]}},this);
    };

    public readonly stateName:StateNameInterface = {
        Idle:"Idle",
    Run:"Run",
    Attack:"Attack"
    };

    public readonly eventName:EventNameInterface = {
        IdleToRun:"IdleToRun",
    RunToAttack:"RunToAttack",
    AttackToIdle:"AttackToIdle"
    };

    protected IdleToRun(...args:any[]): void {this.fsm["IdleToRun"](...args);};
     protected RunToAttack(...args:any[]): void {this.fsm["RunToAttack"](...args);};
     protected AttackToIdle(...args:any[]): void {this.fsm["AttackToIdle"](...args);};

    protected abstract onEnterIdle(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onLeaveIdle(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onEnterRun(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onLeaveRun(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onEnterAttack(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onLeaveAttack(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onBeforeIdleToRun(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onAfterIdleToRun(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onBeforeRunToAttack(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onAfterRunToAttack(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onBeforeAttackToIdle(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onAfterAttackToIdle(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onEnterGlobal(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onLeaveGlobal(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onBeforeGlobal(eventName:string,from:string,to:string,...args:any[]) : void;
    protected abstract onAfterGlobal(eventName:string,from:string,to:string,...args:any[]) : void;

}
    