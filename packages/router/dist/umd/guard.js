(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./type-resolvers", "./viewport-instruction"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const type_resolvers_1 = require("./type-resolvers");
    const viewport_instruction_1 = require("./viewport-instruction");
    class Guard {
        constructor(guard, options, id) {
            this.type = options.type || "before" /* Before */;
            this.guard = guard;
            this.id = id;
            this.includeTargets = [];
            for (const target of options.include || []) {
                this.includeTargets.push(new Target(target));
            }
            this.excludeTargets = [];
            for (const target of options.exclude || []) {
                this.excludeTargets.push(new Target(target));
            }
        }
        matches(viewportInstructions) {
            if (this.includeTargets.length && !this.includeTargets.some(target => target.matches(viewportInstructions))) {
                return false;
            }
            if (this.excludeTargets.length && this.excludeTargets.some(target => target.matches(viewportInstructions))) {
                return false;
            }
            return true;
        }
        check(viewportInstructions, navigationInstruction) {
            return this.guard(viewportInstructions, navigationInstruction);
        }
    }
    exports.Guard = Guard;
    class Target {
        constructor(target) {
            if (typeof target === 'string') {
                this.componentName = target;
            }
            else if (type_resolvers_1.ComponentAppellationResolver.isType(target)) {
                this.component = target;
                this.componentName = type_resolvers_1.ComponentAppellationResolver.getName(target);
            }
            else {
                const cvTarget = target;
                this.component = type_resolvers_1.ComponentAppellationResolver.isType(cvTarget.component) ? type_resolvers_1.ComponentAppellationResolver.getType(cvTarget.component) : null;
                this.componentName = type_resolvers_1.ComponentAppellationResolver.getName(cvTarget.component);
                this.viewport = type_resolvers_1.ViewportHandleResolver.isInstance(cvTarget.viewport) ? cvTarget.viewport : null;
                this.viewportName = type_resolvers_1.ViewportHandleResolver.getName(cvTarget.viewport);
            }
        }
        matches(viewportInstructions) {
            const instructions = viewportInstructions.slice();
            if (!instructions.length) {
                instructions.push(new viewport_instruction_1.ViewportInstruction(''));
            }
            for (const instruction of instructions) {
                if (this.componentName === instruction.componentName ||
                    this.component === instruction.component ||
                    this.viewportName === instruction.viewportName ||
                    this.viewport === instruction.viewport) {
                    return true;
                }
            }
            return false;
        }
    }
});
//# sourceMappingURL=guard.js.map