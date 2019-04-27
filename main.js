function AnimateSemaphore(base) {
    var config={
        text:"",convert:"",container:null,
        figure:null,body:null,head:null,legs:null,arms:null,
        leftleg:null,leftarm:null,leftstick:null,leftflag:null,
        isAnimated:false
    };
    var playingSymbol=Symbol("playing");
    var main=this;
    this.init=()=>{
        base.innerHTML="";
        config.container=$(`<div style="width: 400px;height: 400px;position: relative;"></div>`).appendTo(base);
        config.figure=$(`<div style="width: 60px;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);"></div>`).appendTo(config.container);
        config.head=$(`<div style="position: absolute;background: black;width: 50px;height: 50px;border-radius: 50%;top: -30px;left: 50%;transform: translate(-50%);"></div>`).appendTo(config.figure);
        config.body=$(`<div style="position: absolute;background: black;width: 60px;height: 120px;border-radius: 16px;top: 20px;"></div>`).appendTo(config.figure);
        config.legs=$(`<div></div>`).appendTo(config.figure);
        config.leftleg=$(`<div style="position: absolute;background: black;width: 20px;height: 80px;border-radius: 16px;left: 0px;top: 120px;"></div>`).appendTo(config.legs);
        config.rightleg=$(`<div style="position: absolute;background: black;width: 20px;height: 80px;border-radius: 16px;left: 40px;top: 120px;"></div>`).appendTo(config.legs);
        config.arms=$(`<div></div>`).appendTo(config.figure);
        config.leftarm=$(`<div style="position: absolute;background: black;width: 20px;height: 80px;border-radius: 16px;left: -20px;top: 20px;transition: all ease-in-out 500ms;transform-origin: 10px 10px;"></div>`).appendTo(config.arms);
        config.leftstick=$(`<div style="position: absolute;background: black;width: 10px;height: 90px;border-radius: 16px;bottom: -90px;left: 5px;"></div>`).appendTo(config.leftarm);
        config.leftflag=$(`<div style="background: yellow;width: 40px;height: 40px;position: absolute;bottom: 0px;left: 10px;background-image: -webkit-linear-gradient(45deg, red 50%, yellow 50%);"></div>`).appendTo(config.leftstick);
        config.rightarm=$(`<div style="position: absolute;background: black;width: 20px;height: 80px;border-radius: 16px;left: 60px;top: 20px;transition: all ease-in-out 500ms;transform-origin: 10px 10px;"></div>`).appendTo(config.arms);
        config.rightstick=$(`<div style="position: absolute;background: black;width: 10px;height: 90px;border-radius: 16px;bottom: -90px;left: 5px;"></div>`).appendTo(config.rightarm);
        config.rightflag=$(`<div style="background: yellow;width: 40px;height: 40px;position: absolute;bottom: 0px;left: -40px;background-image: -webkit-linear-gradient(-45deg, yellow 50%, red 50%);"></div>`).appendTo(config.rightstick);
    }
    this.convertToAnimatable=(t)=>{
        var o=[];
        var currentMode="none";
        var convertor={
            "letters":{
                a:"SW-S",b:"W-S",c:"NW-S",d:"N-S",e:"S-NE",f:"S-E",g:"S-SE",
                h:"W-SW",i:"SW-NW",j:"N-E",k:"SW-N",l:"SW-NE",m:"SW-E",n:"SW-SE",
                o:"W-NW",p:"W-N",q:"W-NE",r:"W-E",s:"W-SE",t:"NW-N",u:"NW-NE",
                v:"N-SE",w:"NE-E",x:"NE-SE",y:"NW-E",z:"SE-E"
            },
            "numbers":"SW-N/SW-S/W-S/NW-S/N-S/S-NE/S-E/S-SE/W-SW/SW-NW".split("/"),
            "none":{" ":"#S"}
        };
        for(var i=0;i<t.length;i++) {
            if("abcdefghijklmnopqrstuvwxyz".split("").includes(t[i].toLowerCase())&&currentMode!=="letters") {
                o.push("N-E");
                currentMode="letters";
            }
            if("0123456789".split("").includes(t[i].toLowerCase())&&currentMode!=="numbers") {
                o.push("N-NE");
                currentMode="numbers";
            }
            if(" "==t[i]) {
                o.push("S-S");
                currentMode="none";
            }

            var n=convertor[currentMode][t[i].toLowerCase()];
            if(n!==undefined)o.push(n);
            else o.push("N-N");
        }
        return o;
    }
    this.setText=(t)=>{
        this.text=t;
    }
    this.isAnimated=()=>{
        return config.isAnimated;
    }
    this.defaultPose=(valid)=>{
        if(config.isAnimated&&valid!==playingSymbol)return;
        this.moveTo("S-S",valid);
    }
    this.moveTo=(tag,valid)=>{
        if(config.isAnimated&&valid!==playingSymbol)return;
        var lftag=tag.split('-')[0];
        var rftag=tag.split('-')[1];
        var lfangles={SE:-45,S:0,SW:45,W:90,NW:135,N:180,NE:225};
        var rfangles={SW:45,S:0,SE:-45,E:-90,NE:-135,N:-180,NW:-225};
        config.leftarm.css("transform",`rotate(${lfangles[lftag]}deg)`);
        config.rightarm.css("transform",`rotate(${rfangles[rftag]}deg)`);
    }
    this.showFrame=(index,valid)=>{
        if(config.isAnimated)return;
        var t=this.convertToAnimatable(this.text);
        this.moveTo(t[index]);
    }
    this.showAnimation=()=>{
        if(config.isAnimated)return;
        console.log("Playing animation for "+this.text);
        config.isAnimated=true;
        var t=this.convertToAnimatable(this.text);
        console.log(t);
        var delay=0;
        for(var i=0;i<t.length;i++) {
            let a=t[i];
            setTimeout(()=>{main.moveTo(a,playingSymbol);},delay*1000);
            delay++;
        }
        setTimeout(()=>{main.defaultPose(playingSymbol);},delay*1000);
        delay++;
        setTimeout(()=>{config.isAnimated=false;},delay*1000);
    }
}
