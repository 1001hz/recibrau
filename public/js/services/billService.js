app.service('billSrv', function ($rootScope, unitSystemConfig, recipeSavedSrv) {

    //Defaults
    var defaults = {
        settings: {
            unitSystem: "Metric"
        },
        grains: [],
        hops: [],
        yeast: []
    }

    this.bill = defaults;
    this.modified = false;


    this.isModified = function () {
        return this.modified;
    }

    this.getBill = function () {
        return this.bill;
    }

    this.setBill = function (recipe) {
        this.bill = recipe;
    }

    this.clearBill = function () {
        this.bill = defaults;
    }

    this.getGrainBill = function () {
        return this.bill.grains;
    }

    this.setGrainBill = function (grains) {
        this.bill.grains = grains;
    }

    this.getHopBill = function () {
        return this.bill.hops;
    }

    this.setHopBill = function (hops) {
        this.bill.hops = hops;
    }

    this.getYeastBill = function () {
        return this.bill.yeast;
    }

    this.setYeastBill = function (yeast) {
        this.bill.yeast = yeast;
    }

    this.getSystemBill = function () {
        return this.bill.settings;
    }

    this.setSystemBill = function (settings) {
        this.bill.settings = settings;
    }



    /*
    this.commonValues = {
        name: "",
        id:0,
        volume: 0,
        unitSystem: {},
        originalGravity: 1.085,
        efficiency: 70,
        pkgl:384
    }

    this.getCommonValues = function()
    {
        return this.commonValues;
    }

    this.setCommonValues = function (commonValues) {
        this.commonValues = commonValues;
        $rootScope.$broadcast('event:data-change');
        return this.commonValues;
    }

    this.setName = function (name) {
        this.commonValues.name = name;
        return this.commonValues.name;
    }
    */

});


app.service('grainBillSrv', function (dataSrv, commonBillSrv) {
    this.grainBill = [];

    this.addToGrainBill = function (grain)
    {
        this.grainBill.push(grain);
        return this.grainBill;
    }

    this.removeFromGrainBill = function (grain)
    {
        var updatedGrainBill = [];
        
        for(i=0; i<this.grainBill.length; i++)
        {
            
            if(this.grainBill[i].id != grain.id)
            {
                updatedGrainBill.push(this.grainBill[i]);
            }
        }
        
        
        this.grainBill = updatedGrainBill;
        return this.grainBill;
    }

    this.setGrainBill = function (grainBill) {
        this.grainBill = grainBill;
    }

    this.getGrainBill = function()
    {
        return this.grainBill;
    }

    this.getGrainWeights = function()
    {
        var commonValues = commonBillSrv.getCommonValues();
        var gravityPoints = (commonValues.originalGravity - 1) * 1000 * commonValues.volume;

        for(i=0;i<this.grainBill.length;i++)
        {
            var grainGravityPts = (gravityPoints / 100) * this.grainBill[i].percentOfGrainBill;
            this.grainBill[i].weight = grainGravityPts / ((this.grainBill[i].maxYield / 100) * (commonValues.efficiency / 100) * commonValues.pkgl);
        }
        return this.grainBill;
    }

});


app.service('hopBillSrv', function (dataSrv, commonBillSrv) {
    this.hopBill = [];

    this.addToHopBill = function (hop) {
        this.hopBill.push(hop);
        return this.hopBill;
    }

    this.removeFromHopBill = function (hop) {
        var updatedHopBill = [];

        for (i = 0; i < this.hopBill.length; i++) {

            if (this.hopBill[i].id != hop.id) {
                updatedHopBill.push(this.hopBill[i]);
            }
        }


        this.hopBill = updatedHopBill;
        return this.hopBill;
    }

    this.getHopBill = function () {
        return this.hopBill;
    }



});
