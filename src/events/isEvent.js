const isEvent = candidate => candidate && candidate.target && candidate.stopPropagation && candidate.preventDefault;

export default isEvent;
